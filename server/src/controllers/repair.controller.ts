import { Request, Response, NextFunction } from 'express';
import { RepairRequest, RepairFile, RepairStatusHistory, RepairQuote, RepairQuoteItem, RepairMessage, sequelize } from '../models';
import { sendSuccess } from '../utils/response.handler';
import { generateRepairNumber } from '../utils/helpers.util';
import { BadRequestError, NotFoundError } from '../errors';

export const REPAIR_STAGES = [
  'Request Submitted',
  'Waiting for Device',
  'Device Received',
  'Initial Inspection',
  'Diagnostics',
  'Quote Prepared',
  'Waiting for Customer Approval',
  'Repair Approved',
  'Repair In Progress',
  'Testing',
  'Repair Completed',
  'Preparing Return Shipment',
  'Shipped',
  'Delivered',
  'Cancelled'
];

export const submitRepairRequest = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const transaction = await sequelize.transaction();
  try {
    const {
      customerName,
      email,
      phone,
      country,
      deviceType,
      brand,
      model,
      serialNumber,
      problemCategory,
      problemDescription,
      hasBeenRepairedBefore
    } = req.body;

    const repairNumber = generateRepairNumber();
    const userId = req.user ? req.user.id : null;

    const repairRequest = await RepairRequest.create({
      repairNumber,
      userId,
      customerName,
      email,
      phone,
      country,
      deviceType,
      brand,
      model,
      serialNumber,
      problemCategory,
      problemDescription,
      hasBeenRepairedBefore: hasBeenRepairedBefore === 'true' || hasBeenRepairedBefore === true,
      status: 'Request Submitted'
    }, { transaction });

    // Handle file attachments
    const files = req.files as Express.Multer.File[];
    if (files && files.length > 0) {
      const fileRecords = files.map(file => ({
        repairRequestId: repairRequest.id,
        fileUrl: `/uploads/${file.filename}`,
        fileType: file.mimetype,
        originalName: file.originalname,
        fileSize: file.size
      }));
      await RepairFile.bulkCreate(fileRecords, { transaction });
    }

    // Status audit trail
    await RepairStatusHistory.create({
      repairRequestId: repairRequest.id,
      status: 'Request Submitted',
      comment: 'Customer submitted repair ticket online',
      updatedBy: customerName
    }, { transaction });

    await transaction.commit();

    return sendSuccess(res, repairRequest, 'Repair request submitted successfully', 201);
  } catch (error) {
    if (transaction && !(transaction as any).finished) {
      await transaction.rollback();
    }
    next(error);
  }
};

export const trackRepair = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { repairNumber, email } = req.query as { repairNumber?: string; email?: string };

    if (!repairNumber) {
      throw new BadRequestError('Repair number is required');
    }

    const where: any = { repairNumber: repairNumber.trim() };
    if (email) {
      where.email = email.trim();
    }

    const repair = await RepairRequest.findOne({
      where,
      include: [
        { model: RepairFile, as: 'files' },
        { model: RepairStatusHistory, as: 'statusHistory' },
        { 
          model: RepairQuote, 
          as: 'quotes',
          include: [{ model: RepairQuoteItem, as: 'items' }]
        },
        { 
          model: RepairMessage, 
          as: 'messages',
          where: { isInternal: false },
          required: false
        }
      ]
    });

    if (!repair) {
      throw new NotFoundError('No repair ticket found matching the criteria');
    }

    const currentStageIndex = REPAIR_STAGES.indexOf(repair.status);

    return sendSuccess(res, {
      repair,
      stages: REPAIR_STAGES,
      currentStageIndex: currentStageIndex !== -1 ? currentStageIndex : 0
    });
  } catch (error) {
    next(error);
  }
};

export const getMyRepairs = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const repairs = await RepairRequest.findAll({
      where: { userId: req.user.id },
      include: [
        { model: RepairQuote, as: 'quotes', include: [{ model: RepairQuoteItem, as: 'items' }] }
      ],
      order: [['createdAt', 'DESC']]
    });
    return sendSuccess(res, repairs);
  } catch (error) {
    next(error);
  }
};

export const handleQuoteDecision = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const transaction = await sequelize.transaction();
  try {
    const { quoteId } = req.params;
    const { decision } = req.body; // 'APPROVE' or 'REJECT'

    const quote = await RepairQuote.findByPk(quoteId, {
      include: [{ model: RepairRequest, as: 'repairRequest' }],
      transaction
    });

    if (!quote) {
      throw new NotFoundError('Quotation not found');
    }

    const repair = quote.repairRequest;

    if (decision === 'APPROVE') {
      quote.status = 'APPROVED';
      quote.customerDecision = 'APPROVED';
      quote.approvedAt = new Date();
      repair.status = 'Repair Approved';
    } else {
      quote.status = 'REJECTED';
      quote.customerDecision = 'REJECTED';
      repair.status = 'Cancelled';
    }

    await quote.save({ transaction });
    await repair.save({ transaction });

    await RepairStatusHistory.create({
      repairRequestId: repair.id,
      status: repair.status,
      comment: `Customer ${decision === 'APPROVE' ? 'approved' : 'rejected'} quotation ($${quote.totalAmount})`,
      updatedBy: req.user ? `${req.user.firstName} ${req.user.lastName}` : 'Customer'
    }, { transaction });

    await transaction.commit();

    return sendSuccess(res, { quote, repair }, `Repair quotation ${decision.toLowerCase()}d successfully`);
  } catch (error) {
    if (transaction && !(transaction as any).finished) {
      await transaction.rollback();
    }
    next(error);
  }
};

export const getRepairMessages = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { repairId } = req.params;

    const where: any = { repairRequestId: repairId };
    // Filter out internal technician notes unless tech or admin
    if (!req.user || (req.user.role !== 'TECHNICIAN' && req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN')) {
      where.isInternal = false;
    }

    const messages = await RepairMessage.findAll({
      where,
      order: [['createdAt', 'ASC']]
    });

    return sendSuccess(res, messages);
  } catch (error) {
    next(error);
  }
};

export const sendRepairMessage = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { repairId } = req.params;
    const { message, isInternal = false, senderName } = req.body;

    const repair = await RepairRequest.findByPk(repairId);
    if (!repair) {
      throw new NotFoundError('Repair request not found');
    }

    let role = 'CUSTOMER';
    let name = senderName || repair.customerName;

    if (req.user) {
      role = req.user.role === 'CUSTOMER' ? 'CUSTOMER' : (req.user.role === 'ADMIN' ? 'ADMIN' : 'TECHNICIAN');
      name = `${req.user.firstName} ${req.user.lastName}`;
    }

    let attachmentUrl = null;
    if (req.file) {
      attachmentUrl = `/uploads/${req.file.filename}`;
    }

    const newMsg = await RepairMessage.create({
      repairRequestId: repairId,
      senderId: req.user ? req.user.id : null,
      senderName: name,
      senderRole: role,
      message,
      attachmentUrl,
      isInternal: role !== 'CUSTOMER' ? (isInternal === 'true' || isInternal === true) : false
    });

    return sendSuccess(res, newMsg, 'Message sent successfully', 201);
  } catch (error) {
    next(error);
  }
};

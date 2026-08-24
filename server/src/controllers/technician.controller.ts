import { Request, Response, NextFunction } from 'express';
import { RepairRequest, RepairQuote, RepairQuoteItem, RepairStatusHistory, TechnicianAssignment, User, sequelize } from '../models';
import { sendSuccess, sendError } from '../utils/response.handler';

export const getAssignedRepairs = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const repairs = await RepairRequest.findAll({
      include: [
        { model: RepairQuote, as: 'quotes', include: [{ model: RepairQuoteItem, as: 'items' }] },
        { model: RepairStatusHistory, as: 'statusHistory' }
      ],
      order: [['updatedAt', 'DESC']]
    });
    return sendSuccess(res, repairs);
  } catch (error) {
    next(error);
  }
};

export const updateRepairStatus = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const transaction = await sequelize.transaction();
  try {
    const { repairId } = req.params;
    const { status, comment } = req.body;

    const repair = await RepairRequest.findByPk(repairId, { transaction });
    if (!repair) {
      await transaction.rollback();
      return sendError(res, 'Repair request not found', 404);
    }

    repair.status = status;
    await repair.save({ transaction });

    await RepairStatusHistory.create({
      repairRequestId: repairId,
      status,
      comment: comment || `Status updated to ${status} by technician`,
      updatedBy: req.user ? `${req.user.firstName} ${req.user.lastName}` : 'Technician'
    }, { transaction });

    await transaction.commit();

    return sendSuccess(res, repair, `Repair status updated to ${status}`);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

export const createOrUpdateQuote = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const transaction = await sequelize.transaction();
  try {
    const { repairId } = req.params;
    const {
      diagnosticFee = 0,
      laborCost = 0,
      shippingCost = 0,
      tax = 0,
      discount = 0,
      items = [],
      notes
    } = req.body;

    const repair = await RepairRequest.findByPk(repairId, { transaction });
    if (!repair) {
      await transaction.rollback();
      return sendError(res, 'Repair request not found', 404);
    }

    let partsTotal = 0;
    const itemRecords: any[] = [];

    for (const item of items) {
      const q = parseInt(item.quantity) || 1;
      const unit = parseFloat(item.unitPrice) || 0;
      const itemTotal = q * unit;
      partsTotal += itemTotal;

      itemRecords.push({
        description: item.description,
        partNumber: item.partNumber || 'GENERIC-PART',
        quantity: q,
        unitPrice: unit,
        totalPrice: itemTotal
      });
    }

    const diag = parseFloat(diagnosticFee) || 0;
    const labor = parseFloat(laborCost) || 0;
    const ship = parseFloat(shippingCost) || 0;
    const tx = parseFloat(tax) || 0;
    const disc = parseFloat(discount) || 0;

    const totalAmount = diag + labor + ship + partsTotal + tx - disc;

    // Destroy existing quotes for fresh recalculation or update
    await RepairQuote.destroy({ where: { repairRequestId: repairId }, transaction });

    const quote = await RepairQuote.create({
      repairRequestId: repairId,
      diagnosticFee: diag,
      laborCost: labor,
      shippingCost: ship,
      tax: tx,
      discount: disc,
      totalAmount,
      status: 'PENDING',
      notes
    }, { transaction });

    for (const itemRecord of itemRecords) {
      await RepairQuoteItem.create({
        ...itemRecord,
        repairQuoteId: quote.id
      }, { transaction });
    }

    // Automatically shift repair status to 'Quote Prepared' & 'Waiting for Customer Approval'
    repair.status = 'Waiting for Customer Approval';
    await repair.save({ transaction });

    await RepairStatusHistory.create({
      repairRequestId: repairId,
      status: 'Waiting for Customer Approval',
      comment: `Technician generated quote #${quote.id} totaling $${totalAmount}`,
      updatedBy: req.user ? `${req.user.firstName} ${req.user.lastName}` : 'Technician'
    }, { transaction });

    await transaction.commit();

    const fullQuote = await RepairQuote.findByPk(quote.id, {
      include: [{ model: RepairQuoteItem, as: 'items' }]
    });

    return sendSuccess(res, fullQuote, 'Quotation generated successfully', 201);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

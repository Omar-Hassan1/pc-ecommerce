import express, { Request, Response, NextFunction } from 'express';
import {
  submitRepairRequest,
  trackRepair,
  getMyRepairs,
  handleQuoteDecision,
  getRepairMessages,
  sendRepairMessage
} from '../controllers/repair.controller';
import { protect } from '../middleware/auth.middleware';
import upload from '../middleware/upload.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  submitRepairSchema,
  trackRepairQuerySchema,
  quoteIdParamsSchema,
  quoteDecisionSchema,
  repairIdParamsSchema,
  sendRepairMessageSchema
} from '../validators/repair.validator';

const router = express.Router();

const optionalAuth = (req: Request, res: Response, next: NextFunction): any => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.post('/', optionalAuth, upload.array('attachments', 5), validate({ body: submitRepairSchema }), submitRepairRequest);
router.get('/track', validate({ query: trackRepairQuerySchema }), trackRepair);
router.get('/my-repairs', protect, getMyRepairs);
router.post('/quote/:quoteId/decision', optionalAuth, validate({ params: quoteIdParamsSchema, body: quoteDecisionSchema }), handleQuoteDecision);
router.get('/:repairId/messages', optionalAuth, validate({ params: repairIdParamsSchema }), getRepairMessages);
router.post('/:repairId/messages', optionalAuth, upload.single('attachment'), validate({ params: repairIdParamsSchema, body: sendRepairMessageSchema }), sendRepairMessage);

export default router;

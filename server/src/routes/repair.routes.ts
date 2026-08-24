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

const router = express.Router();

const optionalAuth = (req: Request, res: Response, next: NextFunction): any => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.post('/', optionalAuth, upload.array('attachments', 5), submitRepairRequest);
router.get('/track', trackRepair);
router.get('/my-repairs', protect, getMyRepairs);
router.post('/quote/:quoteId/decision', optionalAuth, handleQuoteDecision);
router.get('/:repairId/messages', optionalAuth, getRepairMessages);
router.post('/:repairId/messages', optionalAuth, upload.single('attachment'), sendRepairMessage);

export default router;

import express from 'express';
import { getAssignedRepairs, updateRepairStatus, createOrUpdateQuote } from '../controllers/technician.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  repairIdParamsSchema,
  updateRepairStatusSchema,
  createQuoteSchema
} from '../validators/repair.validator';

const router = express.Router();

router.use(protect, authorize('TECHNICIAN', 'ADMIN', 'SUPER_ADMIN'));

router.get('/repairs', getAssignedRepairs);
router.put('/repairs/:repairId/status', validate({ params: repairIdParamsSchema, body: updateRepairStatusSchema }), updateRepairStatus);
router.post('/repairs/:repairId/quote', validate({ params: repairIdParamsSchema, body: createQuoteSchema }), createOrUpdateQuote);

export default router;

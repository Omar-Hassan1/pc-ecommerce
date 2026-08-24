import express from 'express';
import { getAssignedRepairs, updateRepairStatus, createOrUpdateQuote } from '../controllers/technician.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect, authorize('TECHNICIAN', 'ADMIN', 'SUPER_ADMIN'));

router.get('/repairs', getAssignedRepairs);
router.put('/repairs/:repairId/status', updateRepairStatus);
router.post('/repairs/:repairId/quote', createOrUpdateQuote);

export default router;

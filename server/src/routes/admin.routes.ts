import express from 'express';
import { getDashboardStats } from '../controllers/admin.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect, authorize('ADMIN', 'SUPER_ADMIN'));

router.get('/dashboard-stats', getDashboardStats);

export default router;

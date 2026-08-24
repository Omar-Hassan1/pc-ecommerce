import express from 'express';
import { validateCoupon, getCoupons, createCoupon } from '../controllers/coupon.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/validate', validateCoupon);
router.get('/', protect, authorize('ADMIN', 'SUPER_ADMIN'), getCoupons);
router.post('/', protect, authorize('ADMIN', 'SUPER_ADMIN'), createCoupon);

export default router;

import express from 'express';
import { validateCoupon, getCoupons, createCoupon } from '../controllers/coupon.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { validateCouponSchema, createCouponSchema } from '../validators/other.validators';

const router = express.Router();

router.post('/validate', validate({ body: validateCouponSchema }), validateCoupon);
router.get('/', protect, authorize('ADMIN', 'SUPER_ADMIN'), getCoupons);
router.post('/', protect, authorize('ADMIN', 'SUPER_ADMIN'), validate({ body: createCouponSchema }), createCoupon);

export default router;

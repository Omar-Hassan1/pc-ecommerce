const express = require('express');
const router = express.Router();
const { validateCoupon, getCoupons, createCoupon } = require('../controllers/couponController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/validate', validateCoupon);
router.get('/', protect, authorize('ADMIN', 'SUPER_ADMIN'), getCoupons);
router.post('/', protect, authorize('ADMIN', 'SUPER_ADMIN'), createCoupon);

module.exports = router;

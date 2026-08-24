const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, trackOrder, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.post('/', optionalAuth, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/track', trackOrder);
router.put('/:id/status', protect, authorize('ADMIN', 'SUPER_ADMIN'), updateOrderStatus);

module.exports = router;

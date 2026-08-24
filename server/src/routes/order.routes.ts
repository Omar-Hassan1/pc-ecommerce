import express, { Request, Response, NextFunction } from 'express';
import { createOrder, getMyOrders, trackOrder, updateOrderStatus } from '../controllers/order.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

const optionalAuth = (req: Request, res: Response, next: NextFunction): any => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.post('/', optionalAuth, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/track', trackOrder);
router.put('/:id/status', protect, authorize('ADMIN', 'SUPER_ADMIN'), updateOrderStatus);

export default router;

import express, { Request, Response, NextFunction } from 'express';
import { createOrder, getMyOrders, trackOrder, updateOrderStatus } from '../controllers/order.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createOrderSchema,
  trackOrderQuerySchema,
  orderIdParamsSchema,
  updateOrderStatusSchema
} from '../validators/order.validator';

const router = express.Router();

const optionalAuth = (req: Request, res: Response, next: NextFunction): any => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.post('/', optionalAuth, validate({ body: createOrderSchema }), createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/track', validate({ query: trackOrderQuerySchema }), trackOrder);
router.put('/:id/status', protect, authorize('ADMIN', 'SUPER_ADMIN'), validate({ params: orderIdParamsSchema, body: updateOrderStatusSchema }), updateOrderStatus);

export default router;

import express, { Request, Response, NextFunction } from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem } from '../controllers/cart.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  getCartQuerySchema,
  addToCartSchema,
  cartItemIdParamsSchema,
  updateCartItemSchema
} from '../validators/cart.validator';

const router = express.Router();

// Optional auth middleware for guest fallback
const optionalAuth = (req: Request, res: Response, next: NextFunction): any => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.get('/', optionalAuth, validate({ query: getCartQuerySchema }), getCart);
router.post('/add', optionalAuth, validate({ body: addToCartSchema }), addToCart);
router.put('/item/:itemId', validate({ params: cartItemIdParamsSchema, body: updateCartItemSchema }), updateCartItem);
router.delete('/item/:itemId', validate({ params: cartItemIdParamsSchema }), removeCartItem);

export default router;

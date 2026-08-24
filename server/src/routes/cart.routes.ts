import express, { Request, Response, NextFunction } from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem } from '../controllers/cart.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Optional auth middleware for guest fallback
const optionalAuth = (req: Request, res: Response, next: NextFunction): any => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.get('/', optionalAuth, getCart);
router.post('/add', optionalAuth, addToCart);
router.put('/item/:itemId', updateCartItem);
router.delete('/item/:itemId', removeCartItem);

export default router;

import express from 'express';
import { getWishlist, toggleWishlistItem } from '../controllers/wishlist.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', protect, getWishlist);
router.post('/toggle', protect, toggleWishlistItem);

export default router;

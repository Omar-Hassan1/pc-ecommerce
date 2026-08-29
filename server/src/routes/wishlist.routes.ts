import express from 'express';
import { getWishlist, toggleWishlistItem } from '../controllers/wishlist.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { toggleWishlistSchema } from '../validators/other.validators';

const router = express.Router();

router.get('/', protect, getWishlist);
router.post('/toggle', protect, validate({ body: toggleWishlistSchema }), toggleWishlistItem);

export default router;

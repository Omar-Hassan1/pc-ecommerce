import express from 'express';
import { createReview, getProductReviews } from '../controllers/review.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post('/', protect, createReview);

export default router;

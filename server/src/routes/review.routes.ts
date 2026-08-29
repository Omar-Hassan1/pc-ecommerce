import express from 'express';
import { createReview, getProductReviews } from '../controllers/review.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { reviewProductIdParamsSchema, createReviewSchema } from '../validators/other.validators';

const router = express.Router();

router.get('/product/:productId', validate({ params: reviewProductIdParamsSchema }), getProductReviews);
router.post('/', protect, validate({ body: createReviewSchema }), createReview);

export default router;

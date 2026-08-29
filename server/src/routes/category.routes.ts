import express from 'express';
import { getCategories, createCategory } from '../controllers/category.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createCategorySchema } from '../validators/other.validators';

const router = express.Router();

router.get('/', getCategories);
router.post('/', protect, authorize('ADMIN', 'SUPER_ADMIN'), validate({ body: createCategorySchema }), createCategory);

export default router;

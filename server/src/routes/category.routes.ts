import express from 'express';
import { getCategories, createCategory } from '../controllers/category.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', getCategories);
router.post('/', protect, authorize('ADMIN', 'SUPER_ADMIN'), createCategory);

export default router;

import express from 'express';
import { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', getProducts);
router.get('/:identifier', getProductBySlug);
router.post('/', protect, authorize('ADMIN', 'SUPER_ADMIN'), createProduct);
router.put('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), updateProduct);
router.delete('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), deleteProduct);

export default router;

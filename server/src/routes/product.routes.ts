import express from 'express';
import { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  getProductsQuerySchema,
  productIdentifierParamsSchema,
  productIdParamsSchema,
  createProductSchema,
  updateProductSchema
} from '../validators/product.validator';

const router = express.Router();

router.get('/', validate({ query: getProductsQuerySchema }), getProducts);
router.get('/:identifier', validate({ params: productIdentifierParamsSchema }), getProductBySlug);
router.post('/', protect, authorize('ADMIN', 'SUPER_ADMIN'), validate({ body: createProductSchema }), createProduct);
router.put('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), validate({ params: productIdParamsSchema, body: updateProductSchema }), updateProduct);
router.delete('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), validate({ params: productIdParamsSchema }), deleteProduct);

export default router;

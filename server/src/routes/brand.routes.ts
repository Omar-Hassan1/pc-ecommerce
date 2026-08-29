import express from 'express';
import { getBrands, createBrand } from '../controllers/brand.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createBrandSchema } from '../validators/other.validators';

const router = express.Router();

router.get('/', getBrands);
router.post('/', protect, authorize('ADMIN', 'SUPER_ADMIN'), validate({ body: createBrandSchema }), createBrand);

export default router;

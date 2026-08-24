import express from 'express';
import { getBrands, createBrand } from '../controllers/brand.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', getBrands);
router.post('/', protect, authorize('ADMIN', 'SUPER_ADMIN'), createBrand);

export default router;

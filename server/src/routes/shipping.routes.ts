import express from 'express';
import { getShippingMethods, calculateShippingRate } from '../controllers/shipping.controller';

const router = express.Router();

router.get('/methods', getShippingMethods);
router.post('/calculate', calculateShippingRate);

export default router;

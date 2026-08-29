import express from 'express';
import { getShippingMethods, calculateShippingRate } from '../controllers/shipping.controller';
import { validate } from '../middleware/validate.middleware';
import { calculateShippingSchema } from '../validators/other.validators';

const router = express.Router();

router.get('/methods', getShippingMethods);
router.post('/calculate', validate({ body: calculateShippingSchema }), calculateShippingRate);

export default router;

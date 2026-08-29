import express from 'express';
import { createPaymentIntent } from '../controllers/payment.controller';
import { validate } from '../middleware/validate.middleware';
import { createPaymentIntentSchema } from '../validators/other.validators';

const router = express.Router();

router.post('/create-intent', validate({ body: createPaymentIntentSchema }), createPaymentIntent);

export default router;

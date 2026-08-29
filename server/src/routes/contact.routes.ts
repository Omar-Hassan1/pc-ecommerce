import express from 'express';
import { submitContactMessage, subscribeNewsletter, getContactMessages } from '../controllers/contact.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { submitContactSchema, subscribeNewsletterSchema } from '../validators/other.validators';

const router = express.Router();

router.post('/submit', validate({ body: submitContactSchema }), submitContactMessage);
router.post('/newsletter', validate({ body: subscribeNewsletterSchema }), subscribeNewsletter);
router.get('/messages', protect, authorize('ADMIN', 'SUPER_ADMIN'), getContactMessages);

export default router;

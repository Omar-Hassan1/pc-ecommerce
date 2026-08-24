import express from 'express';
import { submitContactMessage, subscribeNewsletter, getContactMessages } from '../controllers/contact.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/submit', submitContactMessage);
router.post('/newsletter', subscribeNewsletter);
router.get('/messages', protect, authorize('ADMIN', 'SUPER_ADMIN'), getContactMessages);

export default router;

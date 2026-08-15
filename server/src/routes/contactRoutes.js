const express = require('express');
const router = express.Router();
const { submitContactMessage, subscribeNewsletter, getContactMessages } = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/submit', submitContactMessage);
router.post('/newsletter', subscribeNewsletter);
router.get('/messages', protect, authorize('ADMIN', 'SUPER_ADMIN'), getContactMessages);

module.exports = router;

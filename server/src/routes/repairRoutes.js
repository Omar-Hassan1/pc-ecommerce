const express = require('express');
const router = express.Router();
const {
  submitRepairRequest,
  trackRepair,
  getMyRepairs,
  handleQuoteDecision,
  getRepairMessages,
  sendRepairMessage
} = require('../controllers/repairController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.post('/', optionalAuth, upload.array('attachments', 5), submitRepairRequest);
router.get('/track', trackRepair);
router.get('/my-repairs', protect, getMyRepairs);
router.post('/quote/:quoteId/decision', optionalAuth, handleQuoteDecision);
router.get('/:repairId/messages', optionalAuth, getRepairMessages);
router.post('/:repairId/messages', optionalAuth, upload.single('attachment'), sendRepairMessage);

module.exports = router;

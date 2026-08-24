const express = require('express');
const router = express.Router();
const { getAssignedRepairs, updateRepairStatus, createOrUpdateQuote } = require('../controllers/technicianController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('TECHNICIAN', 'ADMIN', 'SUPER_ADMIN'));

router.get('/repairs', getAssignedRepairs);
router.put('/repairs/:repairId/status', updateRepairStatus);
router.post('/repairs/:repairId/quote', createOrUpdateQuote);

module.exports = router;

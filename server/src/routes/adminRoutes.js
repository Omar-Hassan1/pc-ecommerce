const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('ADMIN', 'SUPER_ADMIN'));

router.get('/dashboard-stats', getDashboardStats);

module.exports = router;

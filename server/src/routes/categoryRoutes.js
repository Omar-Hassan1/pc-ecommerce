const express = require('express');
const router = express.Router();
const { getCategories, createCategory } = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getCategories);
router.post('/', protect, authorize('ADMIN', 'SUPER_ADMIN'), createCategory);

module.exports = router;

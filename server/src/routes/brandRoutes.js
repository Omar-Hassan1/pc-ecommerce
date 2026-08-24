const express = require('express');
const router = express.Router();
const { getBrands, createBrand } = require('../controllers/brandController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getBrands);
router.post('/', protect, authorize('ADMIN', 'SUPER_ADMIN'), createBrand);

module.exports = router;

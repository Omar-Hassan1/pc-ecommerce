const express = require('express');
const router = express.Router();
const { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/:identifier', getProductBySlug);
router.post('/', protect, authorize('ADMIN', 'SUPER_ADMIN'), createProduct);
router.put('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), updateProduct);
router.delete('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN'), deleteProduct);

module.exports = router;

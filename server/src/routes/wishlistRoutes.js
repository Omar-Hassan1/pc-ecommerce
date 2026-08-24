const express = require('express');
const router = express.Router();
const { getWishlist, toggleWishlistItem } = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getWishlist);
router.post('/toggle', protect, toggleWishlistItem);

module.exports = router;

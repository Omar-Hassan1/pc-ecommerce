const express = require('express');
const router = express.Router();
const { getShippingMethods, calculateShippingRate } = require('../controllers/shippingController');

router.get('/methods', getShippingMethods);
router.post('/calculate', calculateShippingRate);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getBuilderComponents, validateBuildCompatibility } = require('../controllers/pcBuilderController');

router.get('/components', getBuilderComponents);
router.post('/validate', validateBuildCompatibility);

module.exports = router;

import express from 'express';
import { getBuilderComponents, validateBuildCompatibility } from '../controllers/pc-builder.controller';

const router = express.Router();

router.get('/components', getBuilderComponents);
router.post('/validate', validateBuildCompatibility);

export default router;

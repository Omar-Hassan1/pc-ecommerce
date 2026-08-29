import express from 'express';
import { getBuilderComponents, validateBuildCompatibility } from '../controllers/pc-builder.controller';
import { validate } from '../middleware/validate.middleware';
import { builderComponentsQuerySchema, validateBuildSchema } from '../validators/other.validators';

const router = express.Router();

router.get('/components', validate({ query: builderComponentsQuerySchema }), getBuilderComponents);
router.post('/validate', validate({ body: validateBuildSchema }), validateBuildCompatibility);

export default router;

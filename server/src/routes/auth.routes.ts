import express from 'express';
import { register, login, getMe, updateProfile, changePassword } from '../controllers/auth.controller';
import { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema } from '../validators/auth.validator';
import { validate } from '../middleware/validate.middleware';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register', validate({ body: registerSchema }), register);
router.post('/login', validate({ body: loginSchema }), login);
router.get('/me', protect, getMe);
router.put('/profile', protect, validate({ body: updateProfileSchema }), updateProfile);
router.put('/change-password', protect, validate({ body: changePasswordSchema }), changePassword);

export default router;

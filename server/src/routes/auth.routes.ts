import express from 'express';
import { register, login, getMe, updateProfile, changePassword } from '../controllers/auth.controller';
import { registerValidation, loginValidation } from '../validators/auth.validator';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

export default router;

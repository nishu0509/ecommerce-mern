import express from 'express';
import { register, login, logout, getProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate, registerRules, loginRules } from '../middleware/validateMiddleware.js';
import { loginLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

router.post('/register', registerRules, validate, register);
router.post('/login', loginLimiter, loginRules, validate, login);
router.post('/logout', logout);
router.get('/profile', protect, getProfile);

export default router;
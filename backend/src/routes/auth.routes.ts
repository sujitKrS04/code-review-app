import { Router } from 'express';
import { body } from 'express-validator';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { authLimiter } from '../middleware/rate-limit.middleware';

const router = Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').trim().notEmpty().withMessage('Name is required'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// Routes
router.post('/register', authLimiter, validate(registerValidation), authController.register);
router.post('/login', authLimiter, validate(loginValidation), authController.login);
router.get('/me', authenticate, authController.getMe);

export default router;

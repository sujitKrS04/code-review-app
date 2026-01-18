import { Router } from 'express';
import { body } from 'express-validator';
import { practiceController } from '../controllers/practice.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// Validation rules
const generateValidation = [
  body('weakAreas').isArray().withMessage('Weak areas must be an array'),
  body('difficulty').optional().isIn(['EASY', 'MEDIUM', 'HARD']),
  body('language').notEmpty().withMessage('Language is required'),
];

const submitValidation = [
  body('problemId').isUUID().withMessage('Valid problem ID is required'),
  body('code').trim().notEmpty().withMessage('Code is required'),
];

// Routes (all require authentication)
router.get('/problems', authenticate, practiceController.getProblems);
router.post('/generate', authenticate, validate(generateValidation), practiceController.generateProblem);
router.post('/submit', authenticate, validate(submitValidation), practiceController.submitSolution);

export default router;

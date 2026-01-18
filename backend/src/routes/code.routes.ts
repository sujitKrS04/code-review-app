import { Router } from 'express';
import { body } from 'express-validator';
import { codeController } from '../controllers/code.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// Validation rules
const submitCodeValidation = [
  body('code').trim().notEmpty().withMessage('Code is required'),
  body('language')
    .isIn(['python', 'javascript', 'java', 'cpp', 'typescript'])
    .withMessage('Invalid language'),
  body('assignmentName').trim().notEmpty().withMessage('Assignment name is required'),
];

// Routes (all require authentication)
router.post('/submit', authenticate, validate(submitCodeValidation), codeController.submitCode);
router.get('/submissions', authenticate, codeController.getSubmissions);
router.get('/submission/:id', authenticate, codeController.getSubmission);

export default router;

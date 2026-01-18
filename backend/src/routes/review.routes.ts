import { Router } from 'express';
import { body } from 'express-validator';
import { reviewController } from '../controllers/review.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// Validation rules
const analyzeValidation = [
  body('submissionId').isUUID().withMessage('Valid submission ID is required'),
];

// Routes (all require authentication)
router.post('/analyze', authenticate, validate(analyzeValidation), reviewController.analyzeCode);
router.get('/:submissionId', authenticate, reviewController.getReview);

export default router;

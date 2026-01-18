import { Router } from 'express';
import { body } from 'express-validator';
import { plagiarismController } from '../controllers/plagiarism.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// Validation rules
const checkValidation = [
  body('submissionId').isUUID().withMessage('Valid submission ID is required'),
  body('threshold').optional().isFloat({ min: 0, max: 1 }),
];

// Routes (require authentication and instructor/admin role)
router.post(
  '/check',
  authenticate,
  authorize('INSTRUCTOR', 'ADMIN'),
  validate(checkValidation),
  plagiarismController.checkPlagiarism
);

router.get(
  '/report/:submissionId',
  authenticate,
  authorize('INSTRUCTOR', 'ADMIN'),
  plagiarismController.getReport
);

export default router;

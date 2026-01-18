import { Router } from 'express';
import { progressController } from '../controllers/progress.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Routes (all require authentication)
router.get('/:userId', authenticate, progressController.getUserProgress);
router.get('/:userId/skills', authenticate, progressController.getSkillBreakdown);

export default router;

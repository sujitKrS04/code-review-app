import { Request, Response, NextFunction } from 'express';
import { progressService } from '../services/progress.service';
import { asyncHandler } from '../utils/helpers';

export class ProgressController {
  getUserProgress = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    
    // Check if user is accessing their own progress or is an instructor
    if (userId !== (req as any).user!.id && (req as any).user!.role !== 'INSTRUCTOR' && (req as any).user!.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
      });
      return;
    }

    const progress = await progressService.getUserProgress(userId);

    res.status(200).json({
      success: true,
      data: progress,
    });
  });

  getSkillBreakdown = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    
    // Check permissions
    if (userId !== (req as any).user!.id && (req as any).user!.role !== 'INSTRUCTOR' && (req as any).user!.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
      });
      return;
    }

    const skills = await progressService.getSkillBreakdown(userId);

    res.status(200).json({
      success: true,
      data: skills,
    });
  });
}

export const progressController = new ProgressController();

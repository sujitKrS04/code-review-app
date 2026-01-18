import { Request, Response, NextFunction } from 'express';
import { plagiarismService } from '../services/plagiarism.service';
import { asyncHandler } from '../utils/helpers';

export class PlagiarismController {
  checkPlagiarism = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { submissionId } = req.body;
    const threshold = parseFloat(req.body.threshold) || 0.7;

    const result = await plagiarismService.checkPlagiarism(submissionId, threshold);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Plagiarism check completed',
    });
  });

  getReport = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { submissionId } = req.params;

    const report = await plagiarismService.getPlagiarismReport(submissionId);

    res.status(200).json({
      success: true,
      data: report,
    });
  });
}

export const plagiarismController = new PlagiarismController();

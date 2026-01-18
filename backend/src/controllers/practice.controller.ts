import { Request, Response, NextFunction } from 'express';
import { practiceService } from '../services/practice.service';
import { asyncHandler } from '../utils/helpers';

export class PracticeController {
  getProblems = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { difficulty, category, language } = req.query;

    const problems = await practiceService.getProblems(
      difficulty as string,
      category as string,
      language as string
    );

    res.status(200).json({
      success: true,
      data: problems,
    });
  });

  generateProblem = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { weakAreas, difficulty, language } = req.body;

    const problem = await practiceService.generateProblem(
      weakAreas,
      difficulty || 'MEDIUM',
      language
    );

    res.status(201).json({
      success: true,
      data: problem,
      message: 'Practice problem generated successfully',
    });
  });

  submitSolution = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { problemId, code } = req.body;
    const userId = (req as any).user!.id;

    const result = await practiceService.submitPracticeSolution(problemId, code, userId);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Solution submitted successfully',
    });
  });
}

export const practiceController = new PracticeController();

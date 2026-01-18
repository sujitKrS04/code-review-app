import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { asyncHandler, paginate } from '../utils/helpers';

export class CodeController {
  submitCode = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { code, language, assignmentName } = req.body;
    const userId = (req as any).user!.id;

    const submission = await prisma.submission.create({
      data: {
        userId,
        code,
        language,
        assignmentName,
      },
    });

    res.status(201).json({
      success: true,
      data: submission,
      message: 'Code submitted successfully',
    });
  });

  getSubmissions = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const submissions = await prisma.submission.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        reviews: {
          select: {
            id: true,
            overallScore: true,
            createdAt: true,
          },
        },
      },
    });

    const paginatedData = paginate(submissions, page, limit);

    res.status(200).json({
      success: true,
      ...paginatedData,
    });
  });

  getSubmission = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = (req as any).user!.id;

    const submission = await prisma.submission.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        reviews: true,
        plagiarismChecks: true,
      },
    });

    if (!submission) {
      res.status(404).json({
        success: false,
        error: 'Submission not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: submission,
    });
  });
}

export const codeController = new CodeController();

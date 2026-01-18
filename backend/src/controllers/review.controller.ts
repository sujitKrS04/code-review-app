import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { aiReviewService } from '../services/ai-review.service';
import { codeAnalysisService } from '../services/code-analysis.service';
import { progressService } from '../services/progress.service';
import { asyncHandler } from '../utils/helpers';

export class ReviewController {
  analyzeCode = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { submissionId } = req.body;
    const userId = (req as any).user!.id;

    // Get submission
    const submission = await prisma.submission.findFirst({
      where: {
        id: submissionId,
        userId,
      },
    });

    if (!submission) {
      res.status(404).json({
        success: false,
        error: 'Submission not found',
      });
      return;
    }

    // Get user level for AI review
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { level: true },
    });

    // Run analysis
    const [aiReview, codeAnalysis] = await Promise.all([
      aiReviewService.reviewCode(submission.code, submission.language, user?.level || 'BEGINNER'),
      codeAnalysisService.analyzeCode(submission.code, submission.language),
    ]);

    // Create review
    const review = await prisma.review.create({
      data: {
        submissionId: submission.id,
        overallScore: aiReview.overallScore,
        feedback: JSON.stringify(aiReview.feedback),
        suggestions: JSON.stringify(aiReview.suggestions),
        resources: JSON.stringify(aiReview.resources),
        metrics: JSON.stringify(codeAnalysis.metrics),
        complexity: JSON.stringify(codeAnalysis.complexity),
      },
    });

    // Update progress
    const skillCategories = this.extractSkillCategories(aiReview.feedback);
    await progressService.updateProgress(userId, skillCategories, aiReview.overallScore / 10);

    res.status(200).json({
      success: true,
      data: {
        ...review,
        feedback: aiReview.feedback,
        suggestions: aiReview.suggestions,
        resources: aiReview.resources,
        positives: aiReview.positives,
        complexity: aiReview.complexity,
        codeAnalysis,
      },
      message: 'Code analysis completed',
    });
  });

  getReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { submissionId } = req.params;
    const userId = (req as any).user!.id;

    const review = await prisma.review.findFirst({
      where: {
        submissionId,
        submission: {
          userId,
        },
      },
      include: {
        submission: true,
      },
    });

    if (!review) {
      res.status(404).json({
        success: false,
        error: 'Review not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        ...review,
        feedback: typeof review.feedback === 'string' ? JSON.parse(review.feedback) : review.feedback,
        suggestions: typeof review.suggestions === 'string' ? JSON.parse(review.suggestions) : review.suggestions,
        resources: typeof review.resources === 'string' ? JSON.parse(review.resources) : review.resources,
        metrics: typeof review.metrics === 'string' ? JSON.parse(review.metrics as string) : review.metrics,
        complexity: typeof review.complexity === 'string' ? JSON.parse(review.complexity as string) : review.complexity,
      },
    });
  });

  private extractSkillCategories(feedback: any[]): string[] {
    const categories = new Set<string>();
    
    feedback.forEach(item => {
      if (item.category) {
        categories.add(item.category);
      }
    });

    // Map to standard skill categories
    const skillMap: { [key: string]: string } = {
      'style': 'code-quality',
      'logic': 'algorithms',
      'performance': 'performance',
      'security': 'security',
      'best-practices': 'object-oriented-programming',
    };

    return Array.from(categories).map(cat => skillMap[cat] || 'algorithms');
  }
}

export const reviewController = new ReviewController();

import { prisma } from '../config/database';
import { aiReviewService } from './ai-review.service';
import { logger } from '../utils/logger';

export class PracticeService {
  async getProblems(difficulty?: string, category?: string, language?: string) {
    const where: any = {};

    if (difficulty) where.difficulty = difficulty.toUpperCase();
    if (category) where.category = category;
    if (language) where.language = language;

    const problems = await prisma.practiceProblem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        difficulty: true,
        category: true,
        hints: true,
        testCases: true,
        createdAt: true,
      },
    });

    return problems.map(problem => ({
      ...problem,
      hints: typeof problem.hints === 'string' ? JSON.parse(problem.hints) : problem.hints,
      testCases: typeof problem.testCases === 'string' ? JSON.parse(problem.testCases) : problem.testCases,
    }));
  }

  async generateProblem(weakAreas: string[], difficulty: string = 'MEDIUM', language: string) {
    try {
      // Use AI to generate a custom problem
      const generatedProblem = await aiReviewService.generatePracticeProblem(
        weakAreas,
        difficulty,
        language
      );

      // Save to database
      const problem = await prisma.practiceProblem.create({
        data: {
          title: generatedProblem.title,
          description: generatedProblem.description,
          difficulty: difficulty.toUpperCase() as any,
          category: weakAreas[0] || 'algorithms',
          language,
          hints: JSON.stringify(generatedProblem.hints || []),
          testCases: JSON.stringify(generatedProblem.testCases || []),
          solution: generatedProblem.solution,
        },
      });

      return {
        id: problem.id,
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty.toLowerCase(),
        category: problem.category,
        starterCode: generatedProblem.starterCode || `// ${problem.title}\n// Write your solution here\n`,
        testCases: typeof problem.testCases === 'string' ? JSON.parse(problem.testCases) : problem.testCases,
        hints: typeof problem.hints === 'string' ? JSON.parse(problem.hints) : problem.hints,
      };
    } catch (error) {
      logger.error('Practice Problem Generation Error:', error);
      throw error;
    }
  }

  async submitPracticeSolution(problemId: string, code: string, userId: string) {
    // Get the problem
    const problem = await prisma.practiceProblem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      throw new Error('Problem not found');
    }

    // Run test cases (simplified - in production, use a code execution sandbox)
    const testCases = typeof problem.testCases === 'string' 
      ? JSON.parse(problem.testCases) 
      : problem.testCases;

    const results = testCases.map((testCase: any) => ({
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      passed: Math.random() > 0.3, // Simplified - implement actual code execution
      actualOutput: testCase.expectedOutput, // Simplified
    }));

    const allPassed = results.every((r: any) => r.passed);

    return {
      problemId,
      results,
      allPassed,
      score: allPassed ? 100 : Math.round((results.filter((r: any) => r.passed).length / results.length) * 100),
    };
  }
}

export const practiceService = new PracticeService();

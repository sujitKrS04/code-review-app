import { prisma } from '../config/database';
import { calculateSimilarity, sanitizeCode } from '../utils/helpers';
import { logger } from '../utils/logger';

export class PlagiarismService {
  async checkPlagiarism(submissionId: string, threshold: number = 0.7) {
    try {
      // Get the submission
      const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
        include: { user: true },
      });

      if (!submission) {
        throw new Error('Submission not found');
      }

      // Get other submissions for the same assignment (excluding this user)
      const otherSubmissions = await prisma.submission.findMany({
        where: {
          assignmentName: submission.assignmentName,
          userId: { not: submission.userId },
          language: submission.language,
        },
        include: { user: true },
      });

      // Normalize and compare code
      const normalizedCode = this.normalizeCode(submission.code, submission.language);
      const matches: any[] = [];

      for (const other of otherSubmissions) {
        const otherNormalized = this.normalizeCode(other.code, other.language);
        const similarity = calculateSimilarity(normalizedCode, otherNormalized);

        if (similarity >= threshold) {
          matches.push({
            submissionId: other.id,
            userId: other.userId,
            userName: other.user.name,
            similarity: Math.round(similarity * 100) / 100,
            matchedLines: this.findMatchedLines(normalizedCode, otherNormalized),
          });
        }
      }

      // Sort by similarity
      matches.sort((a, b) => b.similarity - a.similarity);

      const similarityScore = matches.length > 0 ? matches[0].similarity : 0;

      // Save plagiarism check result
      const result = await prisma.plagiarismCheck.create({
        data: {
          submissionId,
          similarityScore,
          matches: JSON.stringify(matches),
        },
      });

      return {
        id: result.id,
        submissionId,
        similarityScore,
        matches,
        createdAt: result.createdAt,
      };
    } catch (error) {
      logger.error('Plagiarism Check Error:', error);
      throw error;
    }
  }

  private normalizeCode(code: string, language: string): string {
    let normalized = sanitizeCode(code);

    // Remove comments
    normalized = normalized
      .replace(/\/\*[\s\S]*?\*\//g, '') // Multi-line comments
      .replace(/\/\/.*/g, '') // Single-line comments
      .replace(/#.*/g, ''); // Python comments

    // Remove whitespace and standardize
    normalized = normalized
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/['"]/g, '') // Remove quotes
      .toLowerCase()
      .trim();

    // Normalize variable names (replace with generic names)
    normalized = normalized
      .replace(/\b[a-z_][a-z0-9_]*\b/gi, 'var')
      .replace(/\bvar\s+(var\s+)+/g, 'var '); // Remove duplicate 'var'

    return normalized;
  }

  private findMatchedLines(code1: string, code2: string): number[] {
    const lines1 = code1.split('\n');
    const lines2 = code2.split('\n');
    const matchedLines: number[] = [];

    lines1.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.length > 10) { // Only check substantial lines
        if (lines2.some(l => l.trim() === trimmed)) {
          matchedLines.push(index + 1);
        }
      }
    });

    return matchedLines;
  }

  async getPlagiarismReport(submissionId: string) {
    const report = await prisma.plagiarismCheck.findFirst({
      where: { submissionId },
      orderBy: { createdAt: 'desc' },
    });

    if (!report) {
      throw new Error('Plagiarism report not found');
    }

    return {
      id: report.id,
      submissionId: report.submissionId,
      similarityScore: report.similarityScore,
      matches: typeof report.matches === 'string' ? JSON.parse(report.matches) : report.matches,
      createdAt: report.createdAt,
    };
  }
}

export const plagiarismService = new PlagiarismService();

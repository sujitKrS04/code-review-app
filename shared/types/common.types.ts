// Common types shared across the application

export type Language = 'python' | 'javascript' | 'java' | 'cpp' | 'typescript';

export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

export type FeedbackSeverity = 'error' | 'warning' | 'info' | 'success';

export type ComplexityNotation = 'O(1)' | 'O(log n)' | 'O(n)' | 'O(n log n)' | 'O(n²)' | 'O(2ⁿ)' | 'O(n!)';

export interface CodeMetrics {
  linesOfCode: number;
  cyclomaticComplexity: number;
  maintainabilityIndex: number;
  codeSmells: number;
  duplicatedLines: number;
}

export interface ComplexityAnalysis {
  timeComplexity: ComplexityNotation;
  spaceComplexity: ComplexityNotation;
  explanation: string;
}

export interface SecurityIssue {
  type: string;
  severity: FeedbackSeverity;
  line: number;
  description: string;
  recommendation: string;
}

export interface LintingResult {
  errors: LintError[];
  warnings: LintWarning[];
  fixableIssues: number;
}

export interface LintError {
  line: number;
  column: number;
  message: string;
  rule: string;
}

export interface LintWarning {
  line: number;
  column: number;
  message: string;
  rule: string;
}

export const LANGUAGE_EXTENSIONS: Record<Language, string> = {
  python: '.py',
  javascript: '.js',
  typescript: '.ts',
  java: '.java',
  cpp: '.cpp',
};

export const LANGUAGE_LABELS: Record<Language, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  java: 'Java',
  cpp: 'C++',
};

export const SKILL_CATEGORIES = [
  'algorithms',
  'data-structures',
  'object-oriented-programming',
  'debugging',
  'testing',
  'code-quality',
  'security',
  'performance',
] as const;

export type SkillCategory = typeof SKILL_CATEGORIES[number];

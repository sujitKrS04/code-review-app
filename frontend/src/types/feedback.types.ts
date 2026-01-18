export interface Review {
  id: string;
  submissionId: string;
  overallScore: number;
  feedback: FeedbackItem[];
  suggestions: SuggestionItem[];
  resources: LearningResource[];
  positives?: string[];
  complexity?: ComplexityAnalysis;
  codeAnalysis?: CodeAnalysis;
  createdAt: string;
}

export interface FeedbackItem {
  line?: number;
  severity: 'error' | 'warning' | 'info' | 'success';
  category: string;
  message: string;
  explanation: string;
}

export interface SuggestionItem {
  line?: number;
  before: string;
  after: string;
  explanation: string;
}

export interface LearningResource {
  title: string;
  url: string;
  type: 'article' | 'video' | 'documentation';
}

export interface ComplexityAnalysis {
  timeComplexity: string;
  spaceComplexity: string;
  explanation: string;
}

export interface CodeAnalysis {
  linting: LintingResult;
  complexity: ComplexityResult;
  security: SecurityResult;
  metrics: CodeMetrics;
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

export interface ComplexityResult {
  timeComplexity: string;
  spaceComplexity: string;
  cyclomaticComplexity: number;
  explanation: string;
}

export interface SecurityResult {
  issues: SecurityIssue[];
  score: number;
}

export interface SecurityIssue {
  type: string;
  severity: string;
  line: number;
  description: string;
  recommendation: string;
}

export interface CodeMetrics {
  linesOfCode: number;
  cyclomaticComplexity: number;
  maintainabilityIndex: number;
  codeSmells: number;
  duplicatedLines: number;
}

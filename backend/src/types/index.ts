export interface CodeAnalysisResult {
  linting: LintingResult;
  complexity: ComplexityResult;
  security: SecurityResult;
  metrics: CodeMetrics;
}

export interface LintingResult {
  errors: Array<{
    line: number;
    column: number;
    message: string;
    rule: string;
  }>;
  warnings: Array<{
    line: number;
    column: number;
    message: string;
    rule: string;
  }>;
  fixableIssues: number;
}

export interface ComplexityResult {
  timeComplexity: string;
  spaceComplexity: string;
  cyclomaticComplexity: number;
  explanation: string;
}

export interface SecurityResult {
  issues: Array<{
    type: string;
    severity: string;
    line: number;
    description: string;
    recommendation: string;
  }>;
  score: number;
}

export interface CodeMetrics {
  linesOfCode: number;
  cyclomaticComplexity: number;
  maintainabilityIndex: number;
  codeSmells: number;
  duplicatedLines: number;
}

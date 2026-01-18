import { CodeAnalysisResult } from '../types';
import { logger } from '../utils/logger';

export class CodeAnalysisService {
  async analyzeCode(code: string, language: string): Promise<CodeAnalysisResult> {
    try {
      const [linting, complexity, security, metrics] = await Promise.all([
        this.runLinting(code, language),
        this.analyzeComplexity(code, language),
        this.checkSecurity(code, language),
        this.calculateMetrics(code),
      ]);

      return {
        linting,
        complexity,
        security,
        metrics,
      };
    } catch (error) {
      logger.error('Code Analysis Error:', error);
      throw error;
    }
  }

  private async runLinting(code: string, language: string): Promise<any> {
    // Simplified linting - in production, integrate ESLint, Pylint, etc.
    const lines = code.split('\n');
    const errors: any[] = [];
    const warnings: any[] = [];

    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // Check for common issues
      if (line.includes('var ') && language === 'javascript') {
        warnings.push({
          line: lineNum,
          column: line.indexOf('var'),
          message: 'Use let or const instead of var',
          rule: 'no-var',
        });
      }

      if (line.trim().startsWith('console.log') && language === 'javascript') {
        warnings.push({
          line: lineNum,
          column: 0,
          message: 'Remove console.log statements before production',
          rule: 'no-console',
        });
      }

      if (line.length > 120) {
        warnings.push({
          line: lineNum,
          column: 120,
          message: 'Line exceeds maximum length of 120 characters',
          rule: 'max-len',
        });
      }
    });

    return {
      errors,
      warnings,
      fixableIssues: warnings.length,
    };
  }

  private async analyzeComplexity(code: string, language: string): Promise<any> {
    // Simplified complexity analysis
    const lines = code.split('\n');
    let cyclomaticComplexity = 1;

    lines.forEach(line => {
      // Count decision points
      if (line.match(/\b(if|else if|while|for|case|catch|\?\?|\|\||&&)\b/)) {
        cyclomaticComplexity++;
      }
    });

    // Estimate time complexity based on nested loops
    const nestedLoopDepth = this.countNestedLoops(code);
    let timeComplexity = 'O(1)';
    
    if (nestedLoopDepth === 1) timeComplexity = 'O(n)';
    else if (nestedLoopDepth === 2) timeComplexity = 'O(n²)';
    else if (nestedLoopDepth >= 3) timeComplexity = 'O(n³)';

    // Check for recursion
    if (code.match(/function\s+(\w+)[\s\S]*?\1\(/)) {
      timeComplexity = 'O(2ⁿ) or O(n log n)';
    }

    return {
      timeComplexity,
      spaceComplexity: 'O(n)',
      cyclomaticComplexity,
      explanation: `The code has a cyclomatic complexity of ${cyclomaticComplexity}. Time complexity is estimated at ${timeComplexity}.`,
    };
  }

  private countNestedLoops(code: string): number {
    let maxDepth = 0;
    let currentDepth = 0;

    const lines = code.split('\n');
    lines.forEach(line => {
      if (line.match(/\b(for|while)\b.*\{/)) {
        currentDepth++;
        maxDepth = Math.max(maxDepth, currentDepth);
      }
      if (line.match(/^\s*\}/)) {
        currentDepth = Math.max(0, currentDepth - 1);
      }
    });

    return maxDepth;
  }

  private async checkSecurity(code: string, language: string): Promise<any> {
    const issues: any[] = [];

    // Check for SQL injection vulnerabilities
    if (code.match(/['"].*SELECT.*FROM.*['"].*\+/) || code.match(/execute\(.*\+/i)) {
      issues.push({
        type: 'SQL Injection',
        severity: 'error',
        line: 0,
        description: 'Potential SQL injection vulnerability detected',
        recommendation: 'Use parameterized queries or prepared statements',
      });
    }

    // Check for XSS vulnerabilities
    if (code.match(/innerHTML\s*=/) || code.match(/document\.write\(/)) {
      issues.push({
        type: 'XSS',
        severity: 'warning',
        line: 0,
        description: 'Potential XSS vulnerability',
        recommendation: 'Sanitize user input before inserting into DOM',
      });
    }

    // Check for hardcoded credentials
    if (code.match(/password\s*=\s*['"][^'"]+['"]/) || code.match(/api[_-]?key\s*=\s*['"][^'"]+['"]/i)) {
      issues.push({
        type: 'Hardcoded Credentials',
        severity: 'error',
        line: 0,
        description: 'Hardcoded credentials detected',
        recommendation: 'Use environment variables for sensitive data',
      });
    }

    const score = Math.max(0, 100 - (issues.length * 20));

    return {
      issues,
      score,
    };
  }

  private async calculateMetrics(code: string): Promise<any> {
    const lines = code.split('\n');
    const codeLines = lines.filter(line => line.trim() && !line.trim().startsWith('//'));

    // Count duplicated lines (simplified)
    const lineMap = new Map<string, number>();
    let duplicatedLines = 0;

    codeLines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.length > 10) { // Only check substantial lines
        const count = (lineMap.get(trimmed) || 0) + 1;
        lineMap.set(trimmed, count);
        if (count === 2) duplicatedLines++;
      }
    });

    // Count code smells
    let codeSmells = 0;
    const codeString = code.toLowerCase();
    
    if (codeString.includes('todo')) codeSmells++;
    if (codeString.includes('fixme')) codeSmells++;
    if (codeString.includes('hack')) codeSmells++;
    if (lines.some(line => line.length > 150)) codeSmells++;

    return {
      linesOfCode: codeLines.length,
      cyclomaticComplexity: this.countNestedLoops(code) + 1,
      maintainabilityIndex: Math.max(0, 100 - (codeSmells * 10) - (duplicatedLines * 5)),
      codeSmells,
      duplicatedLines,
    };
  }
}

export const codeAnalysisService = new CodeAnalysisService();

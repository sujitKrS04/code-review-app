import Groq from 'groq-sdk';
import { config } from './env';

export const groq = new Groq({
  apiKey: config.claudeApiKey, // We'll rename this to groqApiKey in config
});

export const GROQ_MODEL = 'llama-3.3-70b-versatile';

export const MAX_TOKENS = 4096;

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const createGroqPrompt = (code: string, language: string): string => {
  return `You are an expert programming instructor reviewing student code. Analyze the following ${language} code and provide detailed educational feedback.

Code to review:
\`\`\`${language}
${code}
\`\`\`

Please provide a comprehensive code review in JSON format with the following structure:
{
  "overallScore": <number 0-100>,
  "feedback": [
    {
      "line": <line number or null>,
      "severity": "error" | "warning" | "info",
      "category": "style" | "logic" | "performance" | "security" | "best-practices",
      "message": "Brief issue description",
      "explanation": "Detailed pedagogical explanation"
    }
  ],
  "suggestions": [
    {
      "line": <line number or null>,
      "before": "original code snippet",
      "after": "improved code snippet",
      "explanation": "Why this change improves the code"
    }
  ],
  "resources": [
    {
      "title": "Resource title",
      "url": "https://...",
      "type": "article" | "video" | "documentation"
    }
  ],
  "positives": [
    "Things the student did well"
  ],
  "complexity": {
    "time": "O(...)",
    "space": "O(...)",
    "explanation": "Complexity analysis explanation"
  }
}

Focus on:
1. Code correctness and logic errors
2. Best practices and design patterns
3. Performance and efficiency
4. Security vulnerabilities
5. Code readability and maintainability
6. Common beginner mistakes

Be encouraging and educational in your explanations.`;
};

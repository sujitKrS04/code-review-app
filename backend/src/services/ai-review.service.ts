import { groq, GROQ_MODEL, MAX_TOKENS, createGroqPrompt } from '../config/claude';
import { logger } from '../utils/logger';

interface AIReviewResult {
  overallScore: number;
  feedback: any[];
  suggestions: any[];
  resources: any[];
  positives?: string[];
  complexity?: any;
}

export class AIReviewService {
  async reviewCode(code: string, language: string, userLevel: string = 'BEGINNER'): Promise<AIReviewResult> {
    try {
      const prompt = this.createLeveledPrompt(code, language, userLevel);

      logger.info('Calling Groq API for code review...');
      
      const completion = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: MAX_TOKENS,
      });

      logger.info('Groq API response received');

      // Extract the text content
      const responseText = completion.choices[0]?.message?.content || '';

      logger.info('Response text:', responseText.substring(0, 200));

      // Parse JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        logger.error('Could not find JSON in response');
        throw new Error('Could not parse AI response');
      }

      const result = JSON.parse(jsonMatch[0]);

      return {
        overallScore: result.overallScore || 70,
        feedback: result.feedback || [],
        suggestions: result.suggestions || [],
        resources: result.resources || [],
        positives: result.positives || [],
        complexity: result.complexity || null,
      };
    } catch (error: any) {
      logger.error('AI Review Error:', error);
      logger.error('Error details:', error.message);
      logger.error('Error stack:', error.stack);
      
      // Return fallback response
      return {
        overallScore: 70,
        feedback: [
          {
            severity: 'info',
            category: 'general',
            message: 'Unable to generate AI review at this time',
            explanation: `The AI service encountered an error: ${error.message}. Please check the backend logs for more details.`,
          },
        ],
        suggestions: [],
        resources: [],
      };
    }
  }

  private createLeveledPrompt(code: string, language: string, level: string): string {
    const basePrompt = createGroqPrompt(code, language);
    
    const levelGuidance = {
      BEGINNER: '\n\nThis is a beginner student. Focus on:\n- Basic syntax and common mistakes\n- Fundamental concepts\n- Simple, clear explanations\n- Encourage good habits\n- Be very supportive and positive',
      INTERMEDIATE: '\n\nThis is an intermediate student. Focus on:\n- Code organization and structure\n- Design patterns\n- Performance considerations\n- Best practices\n- More advanced concepts',
      ADVANCED: '\n\nThis is an advanced student. Focus on:\n- Advanced optimization\n- Architecture and design\n- Edge cases and scalability\n- Complex algorithms\n- Production-ready code quality',
    };

    return basePrompt + (levelGuidance[level as keyof typeof levelGuidance] || levelGuidance.BEGINNER);
  }

  async generatePracticeProblem(weakAreas: string[], difficulty: string, language: string): Promise<any> {
    try {
      const prompt = `Generate a programming practice problem in ${language} that focuses on: ${weakAreas.join(', ')}.
      
Difficulty level: ${difficulty}

Provide the response in the following JSON format:
{
  "title": "Problem title",
  "description": "Detailed problem description with examples",
  "starterCode": "Starter code template for the problem",
  "hints": ["hint 1", "hint 2", "hint 3"],
  "testCases": [
    "Test case 1: Input -> Expected output",
    "Test case 2: Input -> Expected output",
    "Test case 3: Input -> Expected output"
  ],
  "solution": "Complete solution code"

IMPORTANT: Respond ONLY with valid JSON, no additional text.}`;

      const completion = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: MAX_TOKENS,
      });

      const responseText = completion.choices[0]?.message?.content || '';
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('Could not parse AI response');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      logger.error('Practice Problem Generation Error:', error);
      throw error;
    }
  }
}

export const aiReviewService = new AIReviewService();

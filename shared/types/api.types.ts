// Shared API types between frontend and backend

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: UserDTO;
}

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  createdAt: string;
}

// Code submission types
export interface SubmitCodeRequest {
  code: string;
  language: string;
  assignmentName: string;
}

export interface SubmissionDTO {
  id: string;
  userId: string;
  code: string;
  language: string;
  assignmentName: string;
  createdAt: string;
  reviews?: ReviewDTO[];
}

// Review types
export interface ReviewDTO {
  id: string;
  submissionId: string;
  overallScore: number;
  feedback: FeedbackItem[];
  suggestions: SuggestionItem[];
  resources: LearningResource[];
  createdAt: string;
}

export interface FeedbackItem {
  line?: number;
  severity: 'error' | 'warning' | 'info';
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

// Progress types
export interface ProgressDTO {
  userId: string;
  skills: SkillProgress[];
  overallLevel: number;
  submissionsCount: number;
  achievements: AchievementDTO[];
}

export interface SkillProgress {
  category: string;
  level: number;
  submissionsCount: number;
  trend: 'up' | 'down' | 'stable';
}

export interface AchievementDTO {
  id: string;
  type: string;
  title: string;
  description: string;
  earnedAt: string;
}

// Plagiarism types
export interface PlagiarismCheckRequest {
  submissionId: string;
}

export interface PlagiarismReportDTO {
  id: string;
  submissionId: string;
  similarityScore: number;
  matches: PlagiarismMatch[];
  createdAt: string;
}

export interface PlagiarismMatch {
  submissionId: string;
  userId: string;
  userName: string;
  similarity: number;
  matchedLines: number[];
}

// Practice types
export interface PracticeProblemDTO {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  hints: string[];
  testCases: TestCase[];
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  hidden: boolean;
}

export interface GenerateProblemRequest {
  weakAreas: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  language: string;
}

export interface SubmitPracticeRequest {
  problemId: string;
  code: string;
  language: string;
}

export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  ME: '/auth/me',
  
  // Code
  SUBMIT_CODE: '/code/submit',
  GET_SUBMISSIONS: '/code/submissions',
  GET_SUBMISSION: (id: string) => `/code/submission/${id}`,
  
  // Review
  ANALYZE_CODE: '/review/analyze',
  GET_REVIEW: (submissionId: string) => `/review/${submissionId}`,
  
  // Progress
  GET_PROGRESS: (userId: string) => `/progress/${userId}`,
  GET_SKILLS: (userId: string) => `/progress/${userId}/skills`,
  
  // Plagiarism
  CHECK_PLAGIARISM: '/plagiarism/check',
  GET_PLAGIARISM_REPORT: (submissionId: string) => `/plagiarism/report/${submissionId}`,
  
  // Practice
  GET_PROBLEMS: '/practice/problems',
  GENERATE_PROBLEM: '/practice/generate',
  SUBMIT_PRACTICE: '/practice/submit',
} as const;

export const QUERY_KEYS = {
  ME: ['me'],
  SUBMISSIONS: ['submissions'],
  SUBMISSION: (id: string) => ['submission', id],
  REVIEW: (id: string) => ['review', id],
  PROGRESS: (userId: string) => ['progress', userId],
  SKILLS: (userId: string) => ['skills', userId],
  PROBLEMS: ['problems'],
} as const;

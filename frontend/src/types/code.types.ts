export interface Submission {
  id: string;
  userId: string;
  code: string;
  language: Language;
  assignmentName: string;
  createdAt: string;
  reviews?: Review[];
}

export interface SubmitCodeRequest {
  code: string;
  language: Language;
  assignmentName: string;
}

export type Language = 'python' | 'javascript' | 'java' | 'cpp' | 'typescript';

export const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
];

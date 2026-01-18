import { create } from 'zustand';
import { Submission } from '@/types/code.types';

interface CodeState {
  currentCode: string;
  currentLanguage: string;
  currentSubmission: Submission | null;
  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
  setSubmission: (submission: Submission | null) => void;
  clearCode: () => void;
}

export const useCodeStore = create<CodeState>((set) => ({
  currentCode: '',
  currentLanguage: 'python',
  currentSubmission: null,
  setCode: (code: string) => set({ currentCode: code }),
  setLanguage: (language: string) => set({ currentLanguage: language }),
  setSubmission: (submission: Submission | null) => set({ currentSubmission: submission }),
  clearCode: () => set({ currentCode: '', currentSubmission: null }),
}));

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/lib/constants';

interface ProgressData {
  userId: string;
  skills: SkillProgress[];
  overallLevel: number;
  submissionsCount: number;
  achievements: Achievement[];
  streak: {
    current: number;
    longest: number;
    lastSubmission?: string;
  };
}

interface SkillProgress {
  category: string;
  level: number;
  submissionsCount: number;
  trend: 'up' | 'down' | 'stable';
}

interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  earnedAt: string;
}

export const useProgress = (userId: string | undefined) => {
  const progressQuery = useQuery({
    queryKey: QUERY_KEYS.PROGRESS(userId || ''),
    queryFn: async () => {
      const { data } = await api.get<{ data: ProgressData }>(API_ENDPOINTS.GET_PROGRESS(userId!));
      return data.data;
    },
    enabled: !!userId,
    retry: 1,
    staleTime: 5000,
  });

  const skillsQuery = useQuery({
    queryKey: QUERY_KEYS.SKILLS(userId || ''),
    queryFn: async () => {
      const { data } = await api.get<{ data: SkillProgress[] }>(API_ENDPOINTS.GET_SKILLS(userId!));
      return data.data;
    },
    enabled: !!userId,
    retry: 1,
    staleTime: 5000,
  });

  return {
    progress: progressQuery.data,
    skills: skillsQuery.data,
    isLoading: progressQuery.isLoading || skillsQuery.isLoading,
    error: progressQuery.error || skillsQuery.error,
  };
};

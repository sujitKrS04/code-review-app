import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/lib/constants';
import { SubmitCodeRequest, Submission } from '@/types/code.types';
import { Review } from '@/types/feedback.types';

export const useCodeReview = () => {
  const queryClient = useQueryClient();

  const submitCodeMutation = useMutation({
    mutationFn: async (data: SubmitCodeRequest) => {
      const response = await api.post<{ data: Submission }>(API_ENDPOINTS.SUBMIT_CODE, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUBMISSIONS });
      toast.success('Code submitted successfully!');
    },
    onError: () => {
      toast.error('Failed to submit code. Please try again.');
    },
  });

  const analyzeCodeMutation = useMutation({
    mutationFn: async (submissionId: string) => {
      const response = await api.post<{ data: Review }>(API_ENDPOINTS.ANALYZE_CODE, { submissionId });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REVIEW(data.submissionId) });
      toast.success('Code analysis completed!');
    },
    onError: () => {
      toast.error('Failed to analyze code. Please try again.');
    },
  });

  const useSubmissions = () => {
    return useQuery({
      queryKey: QUERY_KEYS.SUBMISSIONS,
      queryFn: async () => {
        const { data } = await api.get<{ data: Submission[] }>(API_ENDPOINTS.GET_SUBMISSIONS);
        return data.data;
      },
    });
  };

  const useSubmission = (id: string | undefined) => {
    return useQuery({
      queryKey: QUERY_KEYS.SUBMISSION(id || ''),
      queryFn: async () => {
        const { data } = await api.get<{ data: Submission }>(API_ENDPOINTS.GET_SUBMISSION(id!));
        return data.data;
      },
      enabled: !!id,
    });
  };

  const useReview = (submissionId: string | undefined) => {
    return useQuery({
      queryKey: QUERY_KEYS.REVIEW(submissionId || ''),
      queryFn: async () => {
        const { data } = await api.get<{ data: Review }>(API_ENDPOINTS.GET_REVIEW(submissionId!));
        return data.data;
      },
      enabled: !!submissionId,
    });
  };

  return {
    submitCode: submitCodeMutation.mutateAsync,
    analyzeCode: analyzeCodeMutation.mutateAsync,
    isSubmitting: submitCodeMutation.isPending,
    isAnalyzing: analyzeCodeMutation.isPending,
    useSubmissions,
    useSubmission,
    useReview,
  };
};

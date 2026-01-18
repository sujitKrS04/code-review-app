import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/lib/constants';
import { useAuthStore } from '@/store/authStore';
import { AuthResponse, LoginCredentials, RegisterData } from '@/types/user.types';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setAuth, logout: logoutStore, isAuthenticated } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await api.post<{ data: AuthResponse }>(API_ENDPOINTS.LOGIN, credentials);
      return data.data;
    },
    onSuccess: (data) => {
      setAuth(data);
      toast.success('Login successful!');
      navigate('/dashboard');
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      const { data } = await api.post<{ data: AuthResponse }>(API_ENDPOINTS.REGISTER, userData);
      return data.data;
    },
    onSuccess: (data) => {
      setAuth(data);
      toast.success('Registration successful!');
      navigate('/dashboard');
    },
  });

  const { data: currentUser } = useQuery({
    queryKey: QUERY_KEYS.ME,
    queryFn: async () => {
      const { data } = await api.get(API_ENDPOINTS.ME);
      return data.data;
    },
    enabled: isAuthenticated,
  });

  const logout = () => {
    logoutStore();
    queryClient.clear();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    currentUser,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    isAuthenticated,
  };
};

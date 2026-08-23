import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { httpClient } from '@/lib/httpClient';
import * as authService from '@/services/auth.service';
import { readRefreshToken, saveRefreshToken, clearRefreshToken } from '@/lib/tokenStorage';
import type { AuthUser, LoginCredentials } from '@/types/auth';

const SESSION_QUERY_KEY = ['auth', 'session'] as const;

const HEARTBEAT_INTERVAL_MS = 45_000;

export function useSessionBootstrap() {
  const setStatus = useAuthStore((s) => s.setStatus);
  const setSession = useAuthStore((s) => s.setSession);

  const { data, isLoading, isError } = useQuery<AuthUser>({
    queryKey: SESSION_QUERY_KEY,
    queryFn: async () => {
      const storedRefreshToken = readRefreshToken();
      if (!storedRefreshToken) throw new Error('No session');
      const { data: user } = await httpClient.get<AuthUser>('/auth/me');
      return user;
    },
    retry: false,
    refetchInterval: (query) => (query.state.data ? HEARTBEAT_INTERVAL_MS : false),
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (data) {
      const rememberMe = useAuthStore.getState().rememberMe;
      setSession(data, useAuthStore.getState().accessToken ?? '', rememberMe);
    } else if (isError) {
      clearRefreshToken();
      setStatus('unauthenticated');
    }
  }, [data, isError, setSession, setStatus]);

  return { isLoading };
}

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data, variables) => {
      saveRefreshToken(data.refreshToken, variables.rememberMe);
      const user: AuthUser = {
        id: data.id,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        image: data.image,
      };
      setSession(user, data.accessToken, variables.rememberMe);
      queryClient.setQueryData(SESSION_QUERY_KEY, user);
    },
  });
}

export function useLogout() {
  const clearSession = useAuthStore((s) => s.clearSession);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return () => {
    clearRefreshToken();
    clearSession();
    queryClient.removeQueries({ queryKey: SESSION_QUERY_KEY });
    navigate('/login', { replace: true });
  };
}

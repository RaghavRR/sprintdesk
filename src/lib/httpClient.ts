import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { refresh as refreshRequest } from '@/services/auth.service';
import { readRefreshToken, saveRefreshToken, clearRefreshToken } from '@/lib/tokenStorage';


export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_BASE_URL ?? 'https://dummyjson.com',
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const storedRefreshToken = readRefreshToken();
      if (!storedRefreshToken) {
        throw new Error('No refresh token available');
      }
      const { rememberMe } = useAuthStore.getState();
      const { accessToken, refreshToken: newRefreshToken } = await refreshRequest(storedRefreshToken);
      saveRefreshToken(newRefreshToken, rememberMe);
      useAuthStore.getState().setAccessToken(accessToken);
      return accessToken;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retried) {
      originalRequest._retried = true;
      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);
        return httpClient(originalRequest);
      } catch (refreshError) {
        clearRefreshToken();
        useAuthStore.getState().clearSession();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

import axios from 'axios';
import type { LoginCredentials, LoginResponse, RefreshResponse, AuthUser } from '@/types/auth';

const dummyJsonRoot = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_BASE_URL ?? 'https://dummyjson.com',
});

const ACCESS_TOKEN_TTL_MINS = 1;

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const { data } = await dummyJsonRoot.post<LoginResponse>('/auth/login', {
    username: credentials.username,
    password: credentials.password,
    expiresInMins: ACCESS_TOKEN_TTL_MINS,
  });
  return data;
}

export async function refresh(refreshToken: string): Promise<RefreshResponse> {
  const { data } = await dummyJsonRoot.post<RefreshResponse>('/auth/refresh', {
    refreshToken,
    expiresInMins: ACCESS_TOKEN_TTL_MINS,
  });
  return data;
}

export async function fetchCurrentUser(accessToken: string): Promise<AuthUser> {
  const { data } = await dummyJsonRoot.get<AuthUser>('/auth/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return data;
}

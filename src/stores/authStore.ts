import { create } from 'zustand';
import type { AuthUser } from '@/types/auth';

export type SessionStatus = 'checking' | 'authenticated' | 'unauthenticated';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  status: SessionStatus;
  rememberMe: boolean;
  setSession: (user: AuthUser, accessToken: string, rememberMe: boolean) => void;
  setAccessToken: (accessToken: string) => void;
  setStatus: (status: SessionStatus) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  status: 'checking',
  rememberMe: false,
  setSession: (user, accessToken, rememberMe) =>
    set({ user, accessToken, rememberMe, status: 'authenticated' }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setStatus: (status) => set({ status }),
  clearSession: () => set({ user: null, accessToken: null, status: 'unauthenticated' }),
}));

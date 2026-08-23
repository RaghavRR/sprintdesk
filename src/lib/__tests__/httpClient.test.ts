import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockRefresh = vi.fn();
vi.mock('@/services/auth.service', () => ({
  refresh: (...args: unknown[]) => mockRefresh(...args),
}));

const mockReadRefreshToken = vi.fn(() => 'stored-refresh-token');
vi.mock('@/lib/tokenStorage', () => ({
  readRefreshToken: () => mockReadRefreshToken(),
  saveRefreshToken: vi.fn(),
  clearRefreshToken: vi.fn(),
}));

var requestInterceptor: (config: any) => any;
var responseErrorInterceptor: (error: any) => any;
var instanceCall = vi.fn() as ReturnType<typeof vi.fn> & ((...args: any[]) => any);

vi.mock('axios', () => {
  const instance: any = (...args: unknown[]) => instanceCall(...args);
  instance.interceptors = {
    request: { use: (fn: any) => { requestInterceptor = fn; } },
    response: { use: (_onFulfilled: any, onRejected: any) => { responseErrorInterceptor = onRejected; } },
  };
  return { default: { create: () => instance } };
});

import { httpClient } from '@/lib/httpClient';
import { useAuthStore } from '@/stores/authStore';

describe('httpClient auth interceptor', () => {
  beforeEach(() => {
    mockRefresh.mockReset();
    instanceCall.mockReset();
    mockReadRefreshToken.mockReturnValue('stored-refresh-token');
    useAuthStore.setState({ user: null, accessToken: null, status: 'checking', rememberMe: false });
  });

  it('registers the interceptors on the shared axios instance', () => {
    expect(httpClient).toBeDefined();
    expect(requestInterceptor).toBeTypeOf('function');
    expect(responseErrorInterceptor).toBeTypeOf('function');
  });

  it('attaches the Bearer access token to outgoing requests', () => {
    useAuthStore.getState().setAccessToken('abc123');
    const setHeader = vi.fn();
    const config = requestInterceptor({ headers: { set: setHeader } });

    expect(setHeader).toHaveBeenCalledWith('Authorization', 'Bearer abc123');
    expect(config.headers.set).toBe(setHeader);
  });

  it('refreshes the token and retries the original request after a 401', async () => {
    mockRefresh.mockResolvedValue({ accessToken: 'new-access-token', refreshToken: 'new-refresh-token' });
    instanceCall.mockResolvedValue({ data: 'ok', status: 200 });

    const setHeader = vi.fn();
    const originalRequest = { headers: { set: setHeader } };
    const error = { config: originalRequest, response: { status: 401 } };

    const result = await responseErrorInterceptor(error);

    expect(mockRefresh).toHaveBeenCalledWith('stored-refresh-token');
    expect(setHeader).toHaveBeenCalledWith('Authorization', 'Bearer new-access-token');
    expect(instanceCall).toHaveBeenCalledWith(originalRequest);
    expect(result).toEqual({ data: 'ok', status: 200 });
    expect(useAuthStore.getState().accessToken).toBe('new-access-token');
  });

  it('does not retry a request more than once', async () => {
    const error = {
      config: { headers: { set: vi.fn() }, _retried: true },
      response: { status: 401 },
    };

    await expect(responseErrorInterceptor(error)).rejects.toEqual(error);
    expect(mockRefresh).not.toHaveBeenCalled();
  });

  it('clears the session and rejects when the refresh call itself fails', async () => {
    mockRefresh.mockRejectedValue(new Error('refresh token expired'));
    useAuthStore.getState().setSession(
      { id: 1, username: 'demo', firstName: 'Demo', lastName: 'User', email: 'demo@test.com', image: '' },
      'stale-token',
      false,
    );

    const error = { config: { headers: { set: vi.fn() } }, response: { status: 401 } };

    await expect(responseErrorInterceptor(error)).rejects.toThrow('refresh token expired');
    expect(useAuthStore.getState().status).toBe('unauthenticated');
    expect(useAuthStore.getState().accessToken).toBeNull();
  });

  it('passes through non-401 errors unchanged', async () => {
    const error = { config: { headers: { set: vi.fn() } }, response: { status: 500 } };
    await expect(responseErrorInterceptor(error)).rejects.toEqual(error);
    expect(mockRefresh).not.toHaveBeenCalled();
  });
});

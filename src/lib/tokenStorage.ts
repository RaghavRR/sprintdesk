const REFRESH_TOKEN_KEY = 'sprintdesk.refreshToken';
const REFRESH_TOKEN_EXPIRY_KEY = 'sprintdesk.refreshTokenExpiresAt';
const REFRESH_TOKEN_MODE_KEY = 'sprintdesk.refreshTokenMode';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

type StorageMode = 'local' | 'session';

function storageFor(mode: StorageMode): Storage {
  return mode === 'local' ? window.localStorage : window.sessionStorage;
}

export function saveRefreshToken(token: string, rememberMe: boolean): void {
  const mode: StorageMode = rememberMe ? 'local' : 'session';
  clearRefreshToken();
  const store = storageFor(mode);
  store.setItem(REFRESH_TOKEN_KEY, token);
  store.setItem(REFRESH_TOKEN_MODE_KEY, mode);
  if (rememberMe) {
    store.setItem(REFRESH_TOKEN_EXPIRY_KEY, String(Date.now() + THIRTY_DAYS_MS));
  }
}

export function readRefreshToken(): string | null {
  const mode = (localStorage.getItem(REFRESH_TOKEN_MODE_KEY) as StorageMode | null) ?? 'session';
  const store = storageFor(mode);
  const token = store.getItem(REFRESH_TOKEN_KEY);
  if (!token) return null;

  const expiresAt = store.getItem(REFRESH_TOKEN_EXPIRY_KEY);
  if (expiresAt && Date.now() > Number(expiresAt)) {
    clearRefreshToken();
    return null;
  }
  return token;
}

export function clearRefreshToken(): void {
  for (const mode of ['local', 'session'] as StorageMode[]) {
    const store = storageFor(mode);
    store.removeItem(REFRESH_TOKEN_KEY);
    store.removeItem(REFRESH_TOKEN_EXPIRY_KEY);
    store.removeItem(REFRESH_TOKEN_MODE_KEY);
  }
}

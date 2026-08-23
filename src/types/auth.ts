export interface AuthUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

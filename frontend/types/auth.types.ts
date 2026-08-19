export interface AuthUser {
  id: string;
  email: string;
  username: string;
  name: string;
  avatarUrl?: string | null;
  isGuest: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface SignupPayload {
  email: string;
  username: string;
  name: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

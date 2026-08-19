import { apiClient } from './api-client';
import type { AuthResponse, LoginPayload, SignupPayload } from '@/types/auth.types';

export const authService = {
  async signup(payload: SignupPayload) {
    const { data } = await apiClient.post<AuthResponse>('/auth/signup', payload);
    return data;
  },

  async login(payload: LoginPayload) {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', payload);
    return data;
  },

  async guestLogin() {
    const { data } = await apiClient.post<AuthResponse>('/auth/guest');
    return data;
  },

  googleLoginUrl() {
    const base = apiClient.defaults.baseURL;
    return `${base}/auth/google`;
  },

  async logout() {
    await apiClient.post('/auth/logout');
  },

  async me() {
    const { data } = await apiClient.get('/users/me');
    return data;
  },
};

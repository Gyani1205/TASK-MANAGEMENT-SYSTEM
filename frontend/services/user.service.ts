import { apiClient } from './api-client';
import type { SearchUser } from '@/types/task.types';

export const userService = {
  async search(query: string) {
    const { data } = await apiClient.get<SearchUser[]>('/users', { params: { q: query } });
    return data;
  },
  async getMe() {
    const { data } = await apiClient.get('/users/me');
    return data;
  },
  async updateMe(payload: Partial<{ name: string; username: string; avatarUrl: string }>) {
    const { data } = await apiClient.patch('/users/me', payload);
    return data;
  },
  async deleteMe() {
    await apiClient.delete('/users/me');
  },
};

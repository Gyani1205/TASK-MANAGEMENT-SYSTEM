import { apiClient } from './api-client';
import type { Comment } from '@/types/task.types';

export const commentService = {
  async listForTask(taskId: string) {
    const { data } = await apiClient.get<Comment[]>('/comments', { params: { taskId } });
    return data;
  },
  async create(payload: { body: string; taskId: string; parentId?: string }) {
    const { data } = await apiClient.post<Comment>('/comments', payload);
    return data;
  },
  async update(id: string, body: string) {
    const { data } = await apiClient.patch<Comment>(`/comments/${id}`, { body });
    return data;
  },
  async remove(id: string) {
    await apiClient.delete(`/comments/${id}`);
  },
};

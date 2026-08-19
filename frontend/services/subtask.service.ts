import { apiClient } from './api-client';
import type { Subtask } from '@/types/task.types';

export const subtaskService = {
  async listForTask(taskId: string) {
    const { data } = await apiClient.get<{ subtasks: Subtask[]; progress: number }>('/subtasks', { params: { taskId } });
    return data;
  },
  async create(payload: { title: string; taskId: string }) {
    const { data } = await apiClient.post<Subtask>('/subtasks', payload);
    return data;
  },
  async update(id: string, payload: { title?: string; isDone?: boolean }) {
    const { data } = await apiClient.patch<Subtask>(`/subtasks/${id}`, payload);
    return data;
  },
  async remove(id: string) {
    await apiClient.delete(`/subtasks/${id}`);
  },
};

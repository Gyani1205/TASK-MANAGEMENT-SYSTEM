import { apiClient } from './api-client';
import type { Label } from '@/types/task.types';

export const labelService = {
  async listForProject(projectId: string) {
    const { data } = await apiClient.get<Label[]>('/labels', { params: { projectId } });
    return data;
  },
  async create(payload: { name: string; color?: string; projectId: string }) {
    const { data } = await apiClient.post<Label>('/labels', payload);
    return data;
  },
};

import { apiClient } from './api-client';
import type { Workspace } from '@/types/task.types';

export const workspaceService = {
  async list() {
    const { data } = await apiClient.get<Workspace[]>('/workspaces');
    return data;
  },
  async create(payload: { name: string; description?: string }) {
    const { data } = await apiClient.post<Workspace>('/workspaces', payload);
    return data;
  },
  async get(id: string) {
    const { data } = await apiClient.get(`/workspaces/${id}`);
    return data;
  },
};

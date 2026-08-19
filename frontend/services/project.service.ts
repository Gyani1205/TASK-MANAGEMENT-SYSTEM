import { apiClient } from './api-client';
import type { Project } from '@/types/task.types';

export const projectService = {
  async listForWorkspace(workspaceId: string) {
    const { data } = await apiClient.get<Project[]>('/projects', { params: { workspaceId } });
    return data;
  },
  async get(id: string) {
    const { data } = await apiClient.get(`/projects/${id}`);
    return data;
  },
  async create(payload: { name: string; key: string; description?: string; workspaceId: string; color?: string }) {
    const { data } = await apiClient.post<Project>('/projects', payload);
    return data;
  },
  async update(id: string, payload: Partial<{ name: string; key: string; description: string; color: string }>) {
    const { data } = await apiClient.patch<Project>(`/projects/${id}`, payload);
    return data;
  },
  async remove(id: string) {
    await apiClient.delete(`/projects/${id}`);
  },
};

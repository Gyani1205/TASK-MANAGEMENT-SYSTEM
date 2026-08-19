import { apiClient } from './api-client';
import type { Task, TaskStatus, TaskPriority } from '@/types/task.types';

export interface TaskQueryParams {
  projectId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  reporterId?: string;
  labelId?: string;
  search?: string;
  sortBy?: 'dueDate' | 'priority' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface TaskListResponse {
  tasks: Task[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  projectId: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  assigneeIds?: string[];
  labelIds?: string[];
}

export const taskService = {
  async list(params: TaskQueryParams) {
    const { data } = await apiClient.get<TaskListResponse>('/tasks', { params });
    return data;
  },
  async get(id: string) {
    const { data } = await apiClient.get<Task>(`/tasks/${id}`);
    return data;
  },
  async create(payload: CreateTaskPayload) {
    const { data } = await apiClient.post<Task>('/tasks', payload);
    return data;
  },
  async update(id: string, payload: Partial<CreateTaskPayload>) {
    const { data } = await apiClient.patch<Task>(`/tasks/${id}`, payload);
    return data;
  },
  async reorder(id: string, status: TaskStatus, position: number) {
    const { data } = await apiClient.patch<Task>(`/tasks/${id}/reorder`, { status, position });
    return data;
  },
  async remove(id: string) {
    await apiClient.delete(`/tasks/${id}`);
  },
};

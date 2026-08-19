import { apiClient } from './api-client';
import type { ActivityLogEntry } from '@/types/task.types';

export const activityService = {
  async listForTask(taskId: string) {
    const { data } = await apiClient.get<ActivityLogEntry[]>('/activities', { params: { taskId } });
    return data;
  },
};

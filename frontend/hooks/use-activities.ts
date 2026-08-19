'use client';

import { useQuery } from '@tanstack/react-query';
import { activityService } from '@/services/activity.service';

export function useTaskActivities(taskId: string) {
  return useQuery({
    queryKey: ['activities', taskId],
    queryFn: () => activityService.listForTask(taskId),
    enabled: Boolean(taskId),
  });
}

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { taskService, type CreateTaskPayload } from '@/services/task.service';

export function useTaskDetail(id: string) {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => taskService.get(id),
    enabled: Boolean(id),
  });
}

export function useUpdateTaskDetail(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<CreateTaskPayload>) => taskService.update(id, payload),
    onSuccess: (task) => {
      queryClient.setQueryData(['task', id], task);
      // The board/list views key their cache by filter params we don't know here,
      // so invalidate every cached tasks list rather than guessing the exact key.
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['activities', id] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Could not update task'),
  });
}

export function useDeleteTaskDetail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => taskService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted');
    },
    onError: () => toast.error('Could not delete task'),
  });
}

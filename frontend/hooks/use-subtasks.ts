'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { subtaskService } from '@/services/subtask.service';

export function useSubtasks(taskId: string) {
  return useQuery({
    queryKey: ['subtasks', taskId],
    queryFn: () => subtaskService.listForTask(taskId),
    enabled: Boolean(taskId),
  });
}

function invalidateSubtaskRelated(queryClient: ReturnType<typeof useQueryClient>, taskId: string) {
  queryClient.invalidateQueries({ queryKey: ['subtasks', taskId] });
  queryClient.invalidateQueries({ queryKey: ['task', taskId] });
  queryClient.invalidateQueries({ queryKey: ['activities', taskId] });
  queryClient.invalidateQueries({ queryKey: ['tasks'] });
}

export function useCreateSubtask(taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (title: string) => subtaskService.create({ title, taskId }),
    onSuccess: () => invalidateSubtaskRelated(queryClient, taskId),
    onError: () => toast.error('Could not add subtask'),
  });
}

export function useToggleSubtask(taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isDone }: { id: string; isDone: boolean }) => subtaskService.update(id, { isDone }),
    onSuccess: () => invalidateSubtaskRelated(queryClient, taskId),
    onError: () => toast.error('Could not update subtask'),
  });
}

export function useDeleteSubtask(taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subtaskService.remove(id),
    onSuccess: () => invalidateSubtaskRelated(queryClient, taskId),
    onError: () => toast.error('Could not delete subtask'),
  });
}

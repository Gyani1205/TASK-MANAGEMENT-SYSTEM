'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { taskService, type TaskQueryParams, type TaskListResponse, type CreateTaskPayload } from '@/services/task.service';
import type { Task, TaskStatus } from '@/types/task.types';

export function tasksQueryKey(params: TaskQueryParams) {
  return ['tasks', params] as const;
}

export function useTasks(params: TaskQueryParams) {
  return useQuery({
    queryKey: tasksQueryKey(params),
    queryFn: () => taskService.list(params),
    enabled: Boolean(params.projectId),
    placeholderData: (prev) => prev,
  });
}

export function useCreateTask(params: TaskQueryParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => taskService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksQueryKey(params) });
      toast.success('Task created');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Could not create task'),
  });
}

export function useUpdateTask(params: TaskQueryParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateTaskPayload> }) => taskService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksQueryKey(params) });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Could not update task'),
  });
}

export function useDeleteTask(params: TaskQueryParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => taskService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksQueryKey(params) });
      toast.success('Task deleted');
    },
    onError: () => toast.error('Could not delete task'),
  });
}

/**
 * Drag & drop reorder with an optimistic cache update: the board's local list
 * re-sorts instantly, then rolls back automatically if the API call fails.
 */
export function useReorderTask(params: TaskQueryParams) {
  const queryClient = useQueryClient();
  const key = tasksQueryKey(params);

  return useMutation({
    mutationFn: ({ id, status, position }: { id: string; status: TaskStatus; position: number }) =>
      taskService.reorder(id, status, position),

    onMutate: async ({ id, status, position }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<TaskListResponse>(key);

      if (previous) {
        const moved = previous.tasks.find((t) => t.id === id);
        if (moved) {
          const withoutMoved = previous.tasks.filter((t) => t.id !== id);
          const updated: Task = { ...moved, status, position };

          const columnTasks = withoutMoved
            .filter((t) => t.status === status)
            .sort((a, b) => a.position - b.position);
          columnTasks.splice(position, 0, updated);

          const rest = withoutMoved.filter((t) => t.status !== status);
          queryClient.setQueryData<TaskListResponse>(key, {
            ...previous,
            tasks: [...rest, ...columnTasks],
          });
        }
      }

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
      toast.error('Could not move task — reverted');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
}

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { commentService } from '@/services/comment.service';

export function useComments(taskId: string) {
  return useQuery({
    queryKey: ['comments', taskId],
    queryFn: () => commentService.listForTask(taskId),
    enabled: Boolean(taskId),
  });
}

function invalidateCommentRelated(queryClient: ReturnType<typeof useQueryClient>, taskId: string) {
  queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
  queryClient.invalidateQueries({ queryKey: ['activities', taskId] });
  queryClient.invalidateQueries({ queryKey: ['task', taskId] });
}

export function useCreateComment(taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { body: string; parentId?: string }) => commentService.create({ ...payload, taskId }),
    onSuccess: () => invalidateCommentRelated(queryClient, taskId),
    onError: () => toast.error('Could not post comment'),
  });
}

export function useUpdateComment(taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: string }) => commentService.update(id, body),
    onSuccess: () => invalidateCommentRelated(queryClient, taskId),
    onError: () => toast.error('Could not update comment'),
  });
}

export function useDeleteComment(taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => commentService.remove(id),
    onSuccess: () => invalidateCommentRelated(queryClient, taskId),
    onError: () => toast.error('Could not delete comment'),
  });
}

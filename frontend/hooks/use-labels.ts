'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { labelService } from '@/services/label.service';

export function useLabels(projectId: string) {
  return useQuery({
    queryKey: ['labels', projectId],
    queryFn: () => labelService.listForProject(projectId),
    enabled: Boolean(projectId),
  });
}

export function useCreateLabel(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; color?: string }) => labelService.create({ ...payload, projectId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['labels', projectId] }),
  });
}

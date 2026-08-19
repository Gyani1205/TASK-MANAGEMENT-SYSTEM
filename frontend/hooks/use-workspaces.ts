'use client';

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workspaceService } from '@/services/workspace.service';
import { useWorkspaceStore } from '@/store/workspace-store';

export function useWorkspaces() {
  const currentWorkspaceId = useWorkspaceStore((s) => s.currentWorkspaceId);
  const setCurrentWorkspaceId = useWorkspaceStore((s) => s.setCurrentWorkspaceId);

  const query = useQuery({ queryKey: ['workspaces'], queryFn: workspaceService.list });

  // Keep persisted workspace selections valid after login or workspace changes.
  useEffect(() => {
    if (!query.data || query.data.length === 0) return;

    const currentWorkspaceExists = query.data.some((workspace) => workspace.id === currentWorkspaceId);
    if (!currentWorkspaceExists) {
      setCurrentWorkspaceId(query.data[0].id);
    }
  }, [query.data, currentWorkspaceId, setCurrentWorkspaceId]);

  return query;
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  const setCurrentWorkspaceId = useWorkspaceStore((s) => s.setCurrentWorkspaceId);

  return useMutation({
    mutationFn: workspaceService.create,
    onSuccess: (workspace) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      setCurrentWorkspaceId(workspace.id);
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message ?? err?.message ?? 'Could not create workspace'),
  });
}

'use client';

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { projectService } from '@/services/project.service';
import { useWorkspaceStore } from '@/store/workspace-store';
import { useProjectStore } from '@/store/project-store';

export function useProjects() {
  const workspaceId = useWorkspaceStore((s) => s.currentWorkspaceId);
  const currentProjectId = useProjectStore((s) => s.currentProjectId);
  const setCurrentProjectId = useProjectStore((s) => s.setCurrentProjectId);

  const query = useQuery({
    queryKey: ['projects', workspaceId],
    queryFn: () => projectService.listForWorkspace(workspaceId as string),
    enabled: Boolean(workspaceId),
  });

  useEffect(() => {
    if (!query.data) return;
    const stillValid = query.data.some((p) => p.id === currentProjectId);
    if (!stillValid) {
      setCurrentProjectId(query.data[0]?.id ?? null);
    }
  }, [query.data, currentProjectId, setCurrentProjectId]);

  return query;
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => projectService.get(id),
    enabled: Boolean(id),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceStore((s) => s.currentWorkspaceId);
  const setCurrentProjectId = useProjectStore((s) => s.setCurrentProjectId);

  return useMutation({
    mutationFn: (payload: { name: string; key: string; description?: string }) => {
      if (!workspaceId) {
        throw new Error('Select or create a workspace before creating a project');
      }

      return projectService.create({ ...payload, workspaceId });
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ['projects', workspaceId] });
      setCurrentProjectId(project.id);
      toast.success(`Project "${project.name}" created`);
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message ?? err?.message ?? 'Could not create project'),
  });
}

export function useUpdateProject(id: string) {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceStore((s) => s.currentWorkspaceId);

  return useMutation({
    mutationFn: (payload: Partial<{ name: string; key: string; description: string; color: string }>) =>
      projectService.update(id, payload),
    onSuccess: (project) => {
      queryClient.setQueryData(['project', id], project);
      queryClient.invalidateQueries({ queryKey: ['projects', workspaceId] });
      toast.success('Project updated');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Could not update project'),
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceStore((s) => s.currentWorkspaceId);

  return useMutation({
    mutationFn: (id: string) => projectService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', workspaceId] });
      toast.success('Project deleted');
    },
    onError: () => toast.error('Could not delete project — it may still have tasks'),
  });
}

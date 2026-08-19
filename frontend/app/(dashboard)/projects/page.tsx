'use client';

import { useState } from 'react';
import { Plus, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ProjectCard } from '@/components/projects/project-card';
import { CreateProjectDialog } from '@/components/tasks/create-project-dialog';
import { EditProjectDialog } from '@/components/projects/edit-project-dialog';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { useProjects, useDeleteProject } from '@/hooks/use-projects';
import { useWorkspaceStore } from '@/store/workspace-store';
import type { Project } from '@/types/task.types';

export default function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();
  const deleteProject = useDeleteProject();
  const workspaceId = useWorkspaceStore((state) => state.currentWorkspaceId);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {!workspaceId
              ? 'Create or select a workspace first'
              : projects
                ? `${projects.length} project${projects.length === 1 ? '' : 's'}`
                : 'Organize work by project'}
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} disabled={!workspaceId}>
          <Plus className="h-4 w-4" /> New project
        </Button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      )}

      {!isLoading && projects?.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-16 text-center">
          <FolderKanban className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="font-medium">No projects yet</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Create your first project to start organizing tasks.
          </p>
          <Button className="mt-4" onClick={() => setCreateOpen(true)} disabled={!workspaceId}>
            <Plus className="h-4 w-4" /> New project
          </Button>
        </div>
      )}

      {!isLoading && projects && projects.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => setEditTarget(project)}
              onDelete={() => setDeleteTarget(project)}
            />
          ))}
        </div>
      )}

      <CreateProjectDialog open={createOpen} onOpenChange={setCreateOpen} />

      <EditProjectDialog project={editTarget} open={Boolean(editTarget)} onOpenChange={(open) => !open && setEditTarget(null)} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete "${deleteTarget?.name}"?`}
        description="This permanently deletes the project and every task inside it. This can't be undone."
        confirmLabel="Delete project"
        destructive
        loading={deleteProject.isPending}
        onConfirm={() =>
          deleteTarget &&
          deleteProject.mutate(deleteTarget.id, {
            onSuccess: () => setDeleteTarget(null),
          })
        }
      />
    </div>
  );
}

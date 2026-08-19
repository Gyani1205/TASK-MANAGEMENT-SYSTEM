'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Pencil, Trash2, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListView } from '@/components/tasks/list-view';
import { EditProjectDialog } from '@/components/projects/edit-project-dialog';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { useProject, useDeleteProject } from '@/hooks/use-projects';
import { useTasks } from '@/hooks/use-tasks';
import { useProjectStore } from '@/store/project-store';

export default function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const router = useRouter();
  const { data: project, isLoading } = useProject(projectId);
  const { data: tasksData } = useTasks({ projectId, pageSize: 100 });
  const deleteProject = useDeleteProject();
  const setCurrentProjectId = useProjectStore((s) => s.setCurrentProjectId);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isLoading || !project) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.push('/projects')}>
        <ArrowLeft className="h-4 w-4" /> All projects
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
            style={{ backgroundColor: project.color }}
          >
            {project.key}
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
            {project.description && <p className="text-sm text-muted-foreground">{project.description}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            onClick={() => setCurrentProjectId(project.id)}
          >
            <Link href="/tasks">
              <LayoutGrid className="h-3.5 w-3.5" /> Open board
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-muted-foreground">
          Tasks ({tasksData?.pagination.total ?? 0})
        </h2>
        <ListView tasks={tasksData?.tasks ?? []} onTaskClick={(task) => router.push(`/tasks/${task.id}`)} />
      </div>

      <EditProjectDialog project={project} open={editOpen} onOpenChange={setEditOpen} />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete "${project.name}"?`}
        description="This permanently deletes the project and every task inside it. This can't be undone."
        confirmLabel="Delete project"
        destructive
        loading={deleteProject.isPending}
        onConfirm={() =>
          deleteProject.mutate(project.id, {
            onSuccess: () => router.push('/projects'),
          })
        }
      />
    </div>
  );
}

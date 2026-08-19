'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectPicker } from '@/components/tasks/project-picker';
import { ViewToggle } from '@/components/tasks/view-toggle';
import { TaskFiltersBar } from '@/components/tasks/task-filters-bar';
import { BoardSkeleton } from '@/components/tasks/board-skeleton';
import { EmptyProjectState } from '@/components/tasks/empty-project-state';
import { CreateTaskDialog } from '@/components/tasks/create-task-dialog';
import { KanbanBoard } from '@/components/board/kanban-board';
import { ListView } from '@/components/tasks/list-view';
import { useTasks } from '@/hooks/use-tasks';
import { useFieldVisibility } from '@/hooks/use-settings';
import { useProjectStore } from '@/store/project-store';
import { useUiStore } from '@/store/ui-store';
import type { TaskQueryParams } from '@/services/task.service';
import type { Task, TaskStatus } from '@/types/task.types';

export default function TasksPage() {
  const router = useRouter();
  const currentProjectId = useProjectStore((s) => s.currentProjectId);
  const boardView = useUiStore((s) => s.boardView);

  const [filters, setFilters] = useState<Omit<TaskQueryParams, 'projectId'>>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [createDefaultStatus, setCreateDefaultStatus] = useState<TaskStatus>('TODO');

  const queryParams: TaskQueryParams = {
    projectId: currentProjectId ?? undefined,
    ...filters,
    pageSize: boardView === 'board' ? 100 : 25,
  };

  const { data, isLoading } = useTasks(queryParams);
  const { data: visibility } = useFieldVisibility();

  function handleAddTask(status: TaskStatus) {
    setCreateDefaultStatus(status);
    setCreateOpen(true);
  }

  function handleTaskClick(task: Task) {
    router.push(`/tasks/${task.id}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {data ? `${data.pagination.total} task${data.pagination.total === 1 ? '' : 's'}` : "Manage your team's work"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ProjectPicker />
          <ViewToggle />
          <Button onClick={() => handleAddTask('TODO')} disabled={!currentProjectId}>
            <Plus className="h-4 w-4" /> New task
          </Button>
        </div>
      </div>

      {currentProjectId && (
        <TaskFiltersBar
          filters={{ projectId: currentProjectId, ...filters }}
          onChange={({ projectId, ...rest }) => setFilters(rest)}
        />
      )}

      {!currentProjectId ? (
        <EmptyProjectState />
      ) : isLoading ? (
        <BoardSkeleton />
      ) : boardView === 'board' ? (
        <KanbanBoard
          tasks={data?.tasks ?? []}
          queryParams={queryParams}
          onAddTask={handleAddTask}
          onTaskClick={handleTaskClick}
          visibility={visibility}
        />
      ) : (
        <ListView tasks={data?.tasks ?? []} onTaskClick={handleTaskClick} visibility={visibility} />
      )}

      {currentProjectId && (
        <CreateTaskDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          projectId={currentProjectId}
          defaultStatus={createDefaultStatus}
          queryParams={queryParams}
        />
      )}
    </div>
  );
}

'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { TaskCard } from './task-card';
import type { Task, TaskStatus } from '@/types/task.types';
import type { FieldVisibility } from '@/services/settings.service';

const COLUMN_ACCENT: Record<TaskStatus, string> = {
  TODO: 'bg-slate-400',
  DOING: 'bg-blue-500',
  COMPLETED: 'bg-emerald-500',
  ON_HOLD: 'bg-amber-500',
};

export function KanbanColumn({
  status,
  label,
  tasks,
  onAddTask,
  onTaskClick,
  visibility,
}: {
  status: TaskStatus;
  label: string;
  tasks: Task[];
  onAddTask: () => void;
  onTaskClick: (task: Task) => void;
  visibility?: FieldVisibility;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex w-72 shrink-0 flex-col rounded-lg bg-muted/40">
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className={cn('h-2 w-2 rounded-full', COLUMN_ACCENT[status])} />
          <h3 className="text-sm font-semibold">{label}</h3>
          <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">{tasks.length}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onAddTask}>
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={cn(
            'flex flex-1 flex-col gap-2 overflow-y-auto px-2 pb-3 transition-colors',
            isOver && 'bg-accent/50',
          )}
          style={{ minHeight: 120 }}
        >
          {tasks.length === 0 && (
            <div className="flex flex-1 items-center justify-center rounded-md border border-dashed p-6 text-center text-xs text-muted-foreground">
              No tasks yet
            </div>
          )}
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} visibility={visibility} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

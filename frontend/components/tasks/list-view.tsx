'use client';

import { format } from 'date-fns';
import { TASK_STATUS_LABELS } from '@/lib/constants';
import { PriorityBadge } from './priority-badge';
import { AssigneeStack } from './assignee-stack';
import type { Task } from '@/types/task.types';
import type { FieldVisibility } from '@/services/settings.service';
import { cn } from '@/lib/utils';

export function ListView({
  tasks,
  onTaskClick,
  visibility,
}: {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  visibility?: FieldVisibility;
}) {
  const showStatus = visibility?.visibleStatus ?? true;
  const showPriority = visibility?.visiblePriority ?? true;
  const showMembers = visibility?.visibleMembers ?? true;
  const showReporter = visibility?.visibleReporter ?? true;
  const showDueDate = visibility?.visibleDueDate ?? true;

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-16 text-center">
        <p className="text-sm font-medium">No tasks match your filters</p>
        <p className="mt-1 text-xs text-muted-foreground">Try adjusting filters or create a new task.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
          <tr>
            <th className="px-4 py-2.5 font-medium">Title</th>
            {showStatus && <th className="px-4 py-2.5 font-medium">Status</th>}
            {showPriority && <th className="px-4 py-2.5 font-medium">Priority</th>}
            {showMembers && <th className="px-4 py-2.5 font-medium">Assignees</th>}
            {showReporter && <th className="px-4 py-2.5 font-medium">Reporter</th>}
            {showDueDate && <th className="px-4 py-2.5 font-medium">Due date</th>}
          </tr>
        </thead>
        <tbody className="divide-y">
          {tasks.map((task) => (
            <tr key={task.id} onClick={() => onTaskClick(task)} className="cursor-pointer hover:bg-muted/40">
              <td className="max-w-xs truncate px-4 py-2.5 font-medium">{task.title}</td>
              {showStatus && (
                <td className="px-4 py-2.5">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{TASK_STATUS_LABELS[task.status]}</span>
                </td>
              )}
              {showPriority && (
                <td className="px-4 py-2.5">
                  <PriorityBadge priority={task.priority} />
                </td>
              )}
              {showMembers && (
                <td className="px-4 py-2.5">
                  <AssigneeStack assignees={task.assignees} />
                </td>
              )}
              {showReporter && <td className={cn('px-4 py-2.5 text-muted-foreground')}>{task.reporter.name}</td>}
              {showDueDate && (
                <td className="px-4 py-2.5 text-muted-foreground">
                  {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : '—'}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

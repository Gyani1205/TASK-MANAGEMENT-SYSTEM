'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format, isPast } from 'date-fns';
import { CalendarClock, MessageSquare, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PriorityBadge } from '@/components/tasks/priority-badge';
import { AssigneeStack } from '@/components/tasks/assignee-stack';
import type { Task } from '@/types/task.types';
import type { FieldVisibility } from '@/services/settings.service';

export function TaskCard({
  task,
  onClick,
  visibility,
}: {
  task: Task;
  onClick?: () => void;
  visibility?: FieldVisibility;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const doneSubtasks = task.subtasks.filter((s) => s.isDone).length;
  const overdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'COMPLETED';
  const showPriority = visibility?.visiblePriority ?? true;
  const showLabels = visibility?.visibleLabels ?? true;
  const showDueDate = visibility?.visibleDueDate ?? true;
  const showMembers = visibility?.visibleMembers ?? true;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        'cursor-grab space-y-2 rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing',
        isDragging && 'opacity-50 shadow-lg',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug">{task.title}</p>
        {showPriority && <PriorityBadge priority={task.priority} className="shrink-0" />}
      </div>

      {showLabels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.labels.map(({ label }) => (
            <span
              key={label.id}
              className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
              style={{ backgroundColor: label.color }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {showDueDate && task.dueDate && (
            <span className={cn('flex items-center gap-1', overdue && 'font-medium text-destructive')}>
              <CalendarClock className="h-3.5 w-3.5" />
              {format(new Date(task.dueDate), 'MMM d')}
            </span>
          )}
          {task.subtasks.length > 0 && (
            <span className="flex items-center gap-1">
              <ListChecks className="h-3.5 w-3.5" />
              {doneSubtasks}/{task.subtasks.length}
            </span>
          )}
          {task._count.comments > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              {task._count.comments}
            </span>
          )}
        </div>
        {showMembers && <AssigneeStack assignees={task.assignees} />}
      </div>
    </div>
  );
}

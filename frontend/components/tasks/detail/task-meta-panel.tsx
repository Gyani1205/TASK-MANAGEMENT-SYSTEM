'use client';

import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AssigneePicker } from './assignee-picker';
import { LabelPicker } from './label-picker';
import { TASK_STATUSES, TASK_STATUS_LABELS, TASK_PRIORITIES } from '@/lib/constants';
import type { Task, TaskPriority, TaskStatus } from '@/types/task.types';

interface Props {
  task: Task;
  onUpdate: (payload: Partial<{ status: TaskStatus; priority: TaskPriority; dueDate: string; assigneeIds: string[]; labelIds: string[] }>) => void;
}

export function TaskMetaPanel({ task, onUpdate }: Props) {
  return (
    <div className="w-full shrink-0 space-y-5 rounded-lg border bg-card p-4 lg:w-72">
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">Status</p>
        <Select value={task.status} onValueChange={(v) => onUpdate({ status: v as TaskStatus })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {TASK_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{TASK_STATUS_LABELS[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">Priority</p>
        <Select value={task.priority} onValueChange={(v) => onUpdate({ priority: v as TaskPriority })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {TASK_PRIORITIES.map((p) => (
              <SelectItem key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">Due date</p>
        <Input
          type="date"
          value={task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''}
          onChange={(e) => onUpdate({ dueDate: e.target.value || undefined })}
        />
      </div>

      <AssigneePicker assignees={task.assignees} onChange={(assigneeIds) => onUpdate({ assigneeIds })} />

      <LabelPicker projectId={task.projectId} labels={task.labels} onChange={(labelIds) => onUpdate({ labelIds })} />

      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">Reporter</p>
        <div className="flex items-center gap-2 text-sm">
          <Avatar className="h-6 w-6">
            <AvatarImage src={task.reporter.avatarUrl ?? undefined} />
            <AvatarFallback className="text-[10px]">{task.reporter.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          {task.reporter.name}
        </div>
      </div>
    </div>
  );
}

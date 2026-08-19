'use client';

import { formatDistanceToNow } from 'date-fns';
import {
  PlusCircle,
  Pencil,
  Flag,
  RefreshCw,
  Users,
  MessageSquare,
  ListChecks,
  CheckCircle2,
  Tag,
  CalendarClock,
  Activity,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTaskActivities } from '@/hooks/use-activities';
import type { ActivityType } from '@/types/task.types';

const ACTIVITY_ICONS: Record<ActivityType, React.ElementType> = {
  TASK_CREATED: PlusCircle,
  TASK_UPDATED: Pencil,
  PRIORITY_CHANGED: Flag,
  STATUS_CHANGED: RefreshCw,
  MEMBER_CHANGED: Users,
  COMMENT_ADDED: MessageSquare,
  SUBTASK_ADDED: ListChecks,
  SUBTASK_COMPLETED: CheckCircle2,
  LABEL_ADDED: Tag,
  LABEL_REMOVED: Tag,
  DUE_DATE_CHANGED: CalendarClock,
};

export function ActivityTimeline({ taskId }: { taskId: string }) {
  const { data: activities, isLoading } = useTaskActivities(taskId);

  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-1.5 text-sm font-semibold">
        <Activity className="h-4 w-4" /> Activity
      </h3>

      {isLoading && (
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      )}

      {!isLoading && activities?.length === 0 && (
        <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
      )}

      <ol className="space-y-3">
        {activities?.map((entry) => {
          const Icon = ACTIVITY_ICONS[entry.type] ?? Activity;
          return (
            <li key={entry.id} className="flex items-start gap-2.5 text-sm">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted">
                <Icon className="h-3 w-3 text-muted-foreground" />
              </span>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">{entry.user.name}</span> {entry.message}
                <span className="ml-1.5 text-xs">· {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}</span>
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

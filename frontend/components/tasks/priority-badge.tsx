import { ArrowUp, ArrowRight, ArrowDown, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PRIORITY_COLORS } from '@/lib/constants';
import type { TaskPriority } from '@/types/task.types';

const ICONS: Record<TaskPriority, React.ElementType> = {
  LOW: ArrowDown,
  MEDIUM: ArrowRight,
  HIGH: ArrowUp,
  URGENT: AlertTriangle,
};

export function PriorityBadge({ priority, className }: { priority: TaskPriority; className?: string }) {
  const Icon = ICONS[priority];
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium', PRIORITY_COLORS[priority], className)}>
      <Icon className="h-3 w-3" />
      {priority.charAt(0) + priority.slice(1).toLowerCase()}
    </span>
  );
}

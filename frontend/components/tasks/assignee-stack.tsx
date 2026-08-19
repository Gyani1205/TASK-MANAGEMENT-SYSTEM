import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import type { TaskAssignee } from '@/types/task.types';

export function AssigneeStack({ assignees }: { assignees: TaskAssignee[] }) {
  if (assignees.length === 0) return null;

  return (
    <TooltipProvider>
      <div className="flex -space-x-2">
        {assignees.slice(0, 3).map(({ user }) => (
          <Tooltip key={user.id}>
            <TooltipTrigger asChild>
              <Avatar className="h-6 w-6 border-2 border-card">
                <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
                <AvatarFallback className="text-[10px]">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>{user.name}</TooltipContent>
          </Tooltip>
        ))}
        {assignees.length > 3 && (
          <Avatar className="h-6 w-6 border-2 border-card">
            <AvatarFallback className="text-[10px]">+{assignees.length - 3}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </TooltipProvider>
  );
}

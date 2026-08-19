'use client';

import { useState } from 'react';
import { Check, Plus, Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useUserSearch } from '@/hooks/use-user-search';
import type { TaskAssignee } from '@/types/task.types';

interface Props {
  assignees: TaskAssignee[];
  onChange: (userIds: string[]) => void;
}

export function AssigneePicker({ assignees, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const { query, setQuery, users } = useUserSearch();
  const assignedIds = new Set(assignees.map((a) => a.user.id));

  function toggle(userId: string) {
    const next = assignedIds.has(userId)
      ? assignees.map((a) => a.user.id).filter((id) => id !== userId)
      : [...assignees.map((a) => a.user.id), userId];
    onChange(next);
  }

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground">Assignees</p>
      <div className="flex flex-wrap items-center gap-1.5">
        {assignees.map(({ user }) => (
          <div key={user.id} className="flex items-center gap-1.5 rounded-full bg-muted py-0.5 pl-0.5 pr-2 text-xs">
            <Avatar className="h-5 w-5">
              <AvatarImage src={user.avatarUrl ?? undefined} />
              <AvatarFallback className="text-[9px]">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            {user.name}
          </div>
        ))}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-6 w-6 rounded-full">
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-2" align="start">
            <div className="relative mb-2">
              <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search people..."
                className="h-8 pl-7 text-sm"
                autoFocus
              />
            </div>
            <div className="max-h-48 space-y-0.5 overflow-y-auto">
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => toggle(u.id)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={u.avatarUrl ?? undefined} />
                    <AvatarFallback className="text-[10px]">{u.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="flex-1 truncate">{u.name}</span>
                  {assignedIds.has(u.id) && <Check className="h-3.5 w-3.5 text-primary" />}
                </button>
              ))}
              {query && users.length === 0 && (
                <p className="px-2 py-1.5 text-xs text-muted-foreground">No people found</p>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

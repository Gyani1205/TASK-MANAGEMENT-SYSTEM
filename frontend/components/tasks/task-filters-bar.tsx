'use client';

import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { TASK_PRIORITIES, TASK_STATUSES, TASK_STATUS_LABELS } from '@/lib/constants';
import type { TaskQueryParams } from '@/services/task.service';

interface Props {
  filters: TaskQueryParams;
  onChange: (filters: TaskQueryParams) => void;
}

export function TaskFiltersBar({ filters, onChange }: Props) {
  const [searchInput, setSearchInput] = useState(filters.search ?? '');

  // Debounce the free-text search so we don't hit the API on every keystroke.
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchInput !== (filters.search ?? '')) {
        onChange({ ...filters, search: searchInput || undefined, page: 1 });
      }
    }, 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const hasActiveFilters = Boolean(filters.status || filters.priority || filters.search);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative w-full max-w-xs">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search tasks..."
          className="pl-8"
        />
      </div>

      <Select
        value={filters.status ?? 'all'}
        onValueChange={(v) => onChange({ ...filters, status: v === 'all' ? undefined : (v as any), page: 1 })}
      >
        <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {TASK_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>{TASK_STATUS_LABELS[s]}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.priority ?? 'all'}
        onValueChange={(v) => onChange({ ...filters, priority: v === 'all' ? undefined : (v as any), page: 1 })}
      >
        <SelectTrigger className="w-36"><SelectValue placeholder="Priority" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All priorities</SelectItem>
          {TASK_PRIORITIES.map((p) => (
            <SelectItem key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSearchInput('');
            onChange({ projectId: filters.projectId, page: 1 });
          }}
        >
          <X className="h-3.5 w-3.5" /> Clear
        </Button>
      )}
    </div>
  );
}

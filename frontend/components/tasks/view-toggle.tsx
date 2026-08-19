'use client';

import { LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/store/ui-store';

export function ViewToggle() {
  const boardView = useUiStore((s) => s.boardView);
  const setBoardView = useUiStore((s) => s.setBoardView);

  return (
    <div className="inline-flex items-center rounded-md border p-0.5">
      <button
        onClick={() => setBoardView('board')}
        className={cn(
          'flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors',
          boardView === 'board' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground',
        )}
      >
        <LayoutGrid className="h-3.5 w-3.5" /> Board
      </button>
      <button
        onClick={() => setBoardView('list')}
        className={cn(
          'flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors',
          boardView === 'list' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground',
        )}
      >
        <List className="h-3.5 w-3.5" /> List
      </button>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSubtasks, useCreateSubtask, useToggleSubtask, useDeleteSubtask } from '@/hooks/use-subtasks';

export function SubtaskList({ taskId }: { taskId: string }) {
  const { data, isLoading } = useSubtasks(taskId);
  const createSubtask = useCreateSubtask(taskId);
  const toggleSubtask = useToggleSubtask(taskId);
  const deleteSubtask = useDeleteSubtask(taskId);
  const [newTitle, setNewTitle] = useState('');

  function handleAdd() {
    const title = newTitle.trim();
    if (!title) return;
    createSubtask.mutate(title);
    setNewTitle('');
  }

  const progress = data?.progress ?? 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          Subtasks {data && `(${data.subtasks.filter((s) => s.isDone).length}/${data.subtasks.length})`}
        </h3>
        {data && data.subtasks.length > 0 && <span className="text-xs text-muted-foreground">{progress}%</span>}
      </div>

      {data && data.subtasks.length > 0 && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}

      {!isLoading && (
        <ul className="space-y-1.5">
          {data?.subtasks.map((subtask) => (
            <li key={subtask.id} className="group flex items-center gap-2">
              <Checkbox
                checked={subtask.isDone}
                onCheckedChange={(checked) => toggleSubtask.mutate({ id: subtask.id, isDone: Boolean(checked) })}
              />
              <span className={cn('flex-1 text-sm', subtask.isDone && 'text-muted-foreground line-through')}>
                {subtask.title}
              </span>
              <button
                onClick={() => deleteSubtask.mutate(subtask.id)}
                className="opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-2">
        <Input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add a subtask..."
          className="h-8 text-sm"
        />
        <Button size="icon" variant="outline" className="h-8 w-8 shrink-0" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useLabels } from '@/hooks/use-labels';
import type { TaskLabel } from '@/types/task.types';

interface Props {
  projectId: string;
  labels: TaskLabel[];
  onChange: (labelIds: string[]) => void;
}

export function LabelPicker({ projectId, labels, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const { data: allLabels } = useLabels(projectId);
  const attachedIds = new Set(labels.map((l) => l.label.id));

  function toggle(labelId: string) {
    const next = attachedIds.has(labelId)
      ? labels.map((l) => l.label.id).filter((id) => id !== labelId)
      : [...labels.map((l) => l.label.id), labelId];
    onChange(next);
  }

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground">Labels</p>
      <div className="flex flex-wrap items-center gap-1.5">
        {labels.map(({ label }) => (
          <span key={label.id} className="rounded-full px-2 py-0.5 text-xs font-medium text-white" style={{ backgroundColor: label.color }}>
            {label.name}
          </span>
        ))}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-6 w-6 rounded-full">
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-2" align="start">
            <div className="max-h-48 space-y-0.5 overflow-y-auto">
              {allLabels?.map((label) => (
                <button
                  key={label.id}
                  onClick={() => toggle(label.id)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                >
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: label.color }} />
                  <span className="flex-1 truncate">{label.name}</span>
                  {attachedIds.has(label.id) && <Check className="h-3.5 w-3.5 text-primary" />}
                </button>
              ))}
              {allLabels?.length === 0 && (
                <p className="px-2 py-1.5 text-xs text-muted-foreground">No labels in this project yet</p>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

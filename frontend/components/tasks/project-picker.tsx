'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CreateProjectDialog } from './create-project-dialog';
import { useProjects } from '@/hooks/use-projects';
import { useProjectStore } from '@/store/project-store';

export function ProjectPicker() {
  const { data: projects, isLoading } = useProjects();
  const currentProjectId = useProjectStore((s) => s.currentProjectId);
  const setCurrentProjectId = useProjectStore((s) => s.setCurrentProjectId);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Select value={currentProjectId ?? undefined} onValueChange={setCurrentProjectId} disabled={isLoading}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder={isLoading ? 'Loading...' : 'Select a project'} />
        </SelectTrigger>
        <SelectContent>
          {projects?.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name} <span className="text-muted-foreground">({p.key})</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" size="icon" onClick={() => setCreateOpen(true)} title="New project">
        <Plus className="h-4 w-4" />
      </Button>
      <CreateProjectDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}

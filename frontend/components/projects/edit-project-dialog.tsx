'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateProject } from '@/hooks/use-projects';
import type { Project } from '@/types/task.types';

interface FormValues {
  name: string;
  description?: string;
  color: string;
}

const SWATCHES = ['#6366F1', '#F59E0B', '#EC4899', '#E11D48', '#059669', '#0EA5E9', '#8B5CF6', '#111827'];

export function EditProjectDialog({
  project,
  open,
  onOpenChange,
}: {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const updateProject = useUpdateProject(project?.id ?? '');
  const { register, handleSubmit, reset, watch, setValue } = useForm<FormValues>();

  useEffect(() => {
    if (project) reset({ name: project.name, description: project.description ?? '', color: project.color });
  }, [project, reset]);

  const selectedColor = watch('color');

  const onSubmit = (values: FormValues) => {
    updateProject.mutate(values, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name', { required: true, minLength: 2 })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={2} {...register('description')} />
          </div>
          <div className="space-y-1.5">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {SWATCHES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setValue('color', c, { shouldDirty: true })}
                  className="h-7 w-7 rounded-full ring-offset-2 ring-offset-background transition-transform hover:scale-110"
                  style={{ backgroundColor: c, boxShadow: selectedColor === c ? '0 0 0 2px hsl(var(--foreground))' : undefined }}
                />
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateProject.isPending}>
              {updateProject.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

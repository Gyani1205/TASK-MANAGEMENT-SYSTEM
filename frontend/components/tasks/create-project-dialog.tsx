'use client';

import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateProject } from '@/hooks/use-projects';

interface FormValues {
  name: string;
  key: string;
  description?: string;
}

export function CreateProjectDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const createProject = useCreateProject();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();

  const onSubmit = (values: FormValues) => {
    createProject.mutate(values, {
      onSuccess: () => {
        onOpenChange(false);
        reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a project</DialogTitle>
          <DialogDescription>Tasks live inside a project — you'll need at least one to get started.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="name">Project name</Label>
            <Input id="name" placeholder="Engineering" {...register('name', { required: 'Name is required', minLength: 2 })} autoFocus />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="key">Project key</Label>
            <Input
              id="key"
              placeholder="ENG"
              className="uppercase"
              {...register('key', {
                required: 'Key is required',
                minLength: 2,
                maxLength: 6,
                pattern: { value: /^[A-Za-z0-9]+$/, message: 'Alphanumeric only' },
              })}
            />
            {errors.key && <p className="text-xs text-destructive">{errors.key.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea id="description" rows={2} {...register('description')} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createProject.isPending}>
              {createProject.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Create project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

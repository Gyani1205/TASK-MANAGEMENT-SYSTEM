'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { useFieldVisibility, useUpdateFieldVisibility } from '@/hooks/use-settings';
import type { FieldVisibility } from '@/services/settings.service';

const FIELDS: { key: keyof FieldVisibility; label: string; description: string }[] = [
  { key: 'visibleStatus', label: 'Status', description: 'Show the status column on the board and list view' },
  { key: 'visiblePriority', label: 'Priority', description: 'Show the priority badge on task cards' },
  { key: 'visibleMembers', label: 'Members', description: 'Show assignee avatars' },
  { key: 'visibleReporter', label: 'Reporter', description: 'Show who reported each task' },
  { key: 'visibleLabels', label: 'Labels', description: 'Show attached labels on task cards' },
  { key: 'visibleDueDate', label: 'Due date', description: 'Show due dates on task cards' },
];

export function FieldVisibilitySettings() {
  const { data, isLoading } = useFieldVisibility();
  const updateVisibility = useUpdateFieldVisibility();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Field visibility</CardTitle>
        <CardDescription>Choose which columns and fields appear across your boards.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <div className="space-y-3">
            {FIELDS.map((f) => (
              <Skeleton key={f.key} className="h-10 w-full" />
            ))}
          </div>
        )}

        {data &&
          FIELDS.map((field) => (
            <div key={field.key} className="flex items-center justify-between gap-4">
              <div>
                <Label htmlFor={field.key} className="text-sm font-medium">
                  {field.label}
                </Label>
                <p className="text-xs text-muted-foreground">{field.description}</p>
              </div>
              <Switch
                id={field.key}
                checked={data[field.key]}
                onCheckedChange={(checked) => updateVisibility.mutate({ [field.key]: checked })}
              />
            </div>
          ))}
      </CardContent>
    </Card>
  );
}

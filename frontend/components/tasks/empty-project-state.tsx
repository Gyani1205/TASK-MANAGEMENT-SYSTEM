import { FolderPlus } from 'lucide-react';

export function EmptyProjectState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-16 text-center">
      <FolderPlus className="mb-3 h-10 w-10 text-muted-foreground" />
      <p className="font-medium">No project selected</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Create your first project using the picker above to start adding tasks.
      </p>
    </div>
  );
}

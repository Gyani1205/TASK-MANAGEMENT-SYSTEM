import { Skeleton } from '@/components/ui/skeleton';

export function BoardSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {[0, 1, 2, 3].map((col) => (
        <div key={col} className="w-72 shrink-0 space-y-2 rounded-lg bg-muted/40 p-3">
          <Skeleton className="h-5 w-24" />
          {[0, 1].map((card) => (
            <Skeleton key={card} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ))}
    </div>
  );
}

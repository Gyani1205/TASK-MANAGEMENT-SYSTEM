import Link from 'next/link';
import { KanbanSquare } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <KanbanSquare className="h-6 w-6" />
          TaskFlow
        </Link>
        <div className="space-y-3">
          <p className="text-2xl font-medium leading-snug">
            Plan sprints, track work, and ship faster — all in one board.
          </p>
          <p className="text-sm text-primary-foreground/80">
            Kanban boards, list views, nested comments, and activity timelines built for real teams.
          </p>
        </div>
        <p className="text-xs text-primary-foreground/60">© {new Date().getFullYear()} TaskFlow</p>
      </div>

      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}

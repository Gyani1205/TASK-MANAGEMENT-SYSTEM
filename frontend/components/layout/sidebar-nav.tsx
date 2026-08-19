'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { KanbanSquare, LayoutList, FolderKanban, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/tasks', label: 'Tasks', icon: LayoutList },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function SidebarNav({ collapsed }: { collapsed?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 px-2">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted',
              active ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
              collapsed && 'justify-center px-2',
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

export function SidebarLogo({ collapsed }: { collapsed?: boolean }) {
  return (
    <Link href="/tasks" className="flex items-center gap-2 px-3 py-4 text-base font-semibold">
      <KanbanSquare className="h-6 w-6 shrink-0 text-primary" />
      {!collapsed && <span>TaskFlow</span>}
    </Link>
  );
}

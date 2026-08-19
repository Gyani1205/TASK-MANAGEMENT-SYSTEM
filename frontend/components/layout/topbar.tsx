'use client';

import { Search } from 'lucide-react';
import { MobileSidebar } from './mobile-sidebar';
import { Input } from '@/components/ui/input';

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <MobileSidebar />
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search tasks, projects..." className="pl-8" />
      </div>
    </header>
  );
}

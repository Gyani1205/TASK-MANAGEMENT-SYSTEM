'use client';

import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/store/ui-store';
import { SidebarLogo, SidebarNav } from './sidebar-nav';
import { WorkspaceSwitcher } from './workspace-switcher';
import { ThemeSwitcher } from './theme-switcher';
import { UserMenu } from './user-menu';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

export function Sidebar() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-screen shrink-0 flex-col border-r bg-card transition-all duration-200 md:flex',
        collapsed ? 'w-[68px]' : 'w-64',
      )}
    >
      <SidebarLogo collapsed={collapsed} />
      <WorkspaceSwitcher collapsed={collapsed} />
      <Separator className="my-3" />
      <SidebarNav collapsed={collapsed} />
      <div className="mt-auto space-y-1 border-t p-2">
        <ThemeSwitcher collapsed={collapsed} />
        <UserMenu collapsed={collapsed} />
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="absolute -right-3 top-16 hidden h-6 w-6 rounded-full border bg-background shadow-sm md:flex"
      >
        {collapsed ? <PanelLeftOpen className="h-3.5 w-3.5" /> : <PanelLeftClose className="h-3.5 w-3.5" />}
      </Button>
    </aside>
  );
}

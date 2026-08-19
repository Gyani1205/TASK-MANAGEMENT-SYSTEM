'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SidebarLogo, SidebarNav } from './sidebar-nav';
import { WorkspaceSwitcher } from './workspace-switcher';
import { ThemeSwitcher } from './theme-switcher';
import { UserMenu } from './user-menu';
import { Separator } from '@/components/ui/separator';

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-72 flex-col p-0">
        <SidebarLogo />
        <WorkspaceSwitcher />
        <Separator className="my-3" />
        <div onClick={() => setOpen(false)}>
          <SidebarNav />
        </div>
        <div className="mt-auto space-y-1 border-t p-2">
          <ThemeSwitcher />
          <UserMenu />
        </div>
      </SheetContent>
    </Sheet>
  );
}

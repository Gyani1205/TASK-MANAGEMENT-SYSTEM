'use client';

import { Moon, Sun, Check } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAccent } from '@/providers/theme-provider';
import { cn } from '@/lib/utils';
import { ACCENT_COLORS } from '@/lib/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function ThemeSwitcher({ collapsed }: { collapsed?: boolean }) {
  const { theme, setTheme } = useTheme();
  const { accent, setAccent } = useAccent();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={collapsed ? 'icon' : 'default'} className={cn(!collapsed && 'w-full justify-start gap-2')}>
          {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          {!collapsed && <span>Theme</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="right" className="w-56">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="h-4 w-4" /> Light {theme === 'light' && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="h-4 w-4" /> Dark {theme === 'dark' && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System {theme === 'system' && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Accent color</DropdownMenuLabel>
        <div className="grid grid-cols-6 gap-2 px-2 py-1.5">
          {ACCENT_COLORS.map((c) => (
            <button
              key={c.value}
              aria-label={c.label}
              onClick={() => setAccent(c.value)}
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full ring-offset-1 ring-offset-background transition-transform hover:scale-110',
                accent === c.value && 'ring-2 ring-foreground',
              )}
              style={{ backgroundColor: c.swatch }}
            >
              {accent === c.value && <Check className="h-3 w-3 text-white" />}
            </button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

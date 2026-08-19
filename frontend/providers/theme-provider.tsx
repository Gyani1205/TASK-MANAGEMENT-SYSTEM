'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

type Accent = 'blue' | 'amber' | 'pink' | 'rose' | 'emerald' | 'black';

interface AccentContextValue {
  accent: Accent;
  setAccent: (accent: Accent) => void;
}

const AccentContext = React.createContext<AccentContextValue | undefined>(undefined);

const ACCENT_STORAGE_KEY = 'taskflow-accent';

function AccentProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccentState] = React.useState<Accent>('blue');

  React.useEffect(() => {
    const stored = window.localStorage.getItem(ACCENT_STORAGE_KEY) as Accent | null;
    const initial = stored ?? 'blue';
    setAccentState(initial);
    document.documentElement.setAttribute('data-accent', initial);
  }, []);

  const setAccent = React.useCallback((next: Accent) => {
    setAccentState(next);
    document.documentElement.setAttribute('data-accent', next);
    window.localStorage.setItem(ACCENT_STORAGE_KEY, next);
  }, []);

  return <AccentContext.Provider value={{ accent, setAccent }}>{children}</AccentContext.Provider>;
}

export function useAccent() {
  const ctx = React.useContext(AccentContext);
  if (!ctx) throw new Error('useAccent must be used within AccentProvider');
  return ctx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AccentProvider>{children}</AccentProvider>
    </NextThemesProvider>
  );
}

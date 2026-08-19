'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useAccent } from '@/providers/theme-provider';
import { themeService, type ThemePreferenceDto } from '@/services/theme.service';

const MODE_TO_SERVER: Record<string, ThemePreferenceDto['mode']> = {
  light: 'LIGHT',
  dark: 'DARK',
  system: 'SYSTEM',
};
const MODE_FROM_SERVER: Record<ThemePreferenceDto['mode'], string> = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};
const ACCENT_FROM_SERVER: Record<ThemePreferenceDto['accent'], string> = {
  BLUE: 'blue',
  AMBER: 'amber',
  PINK: 'pink',
  ROSE: 'rose',
  EMERALD: 'emerald',
  BLACK: 'black',
};
const ACCENT_TO_SERVER: Record<string, ThemePreferenceDto['accent']> = {
  blue: 'BLUE',
  amber: 'AMBER',
  pink: 'PINK',
  rose: 'ROSE',
  emerald: 'EMERALD',
  black: 'BLACK',
};

/**
 * Hydrates the theme/accent from the backend once per session (server wins,
 * so preferences follow the user across devices), then pushes local changes
 * back up after that — on top of the localStorage persistence that already
 * makes theme survive a plain refresh with zero network round trip.
 */
export function useThemeSync(enabled: boolean) {
  const { theme, setTheme } = useTheme();
  const { accent, setAccent } = useAccent();
  const hydrated = useRef(false);

  useEffect(() => {
    if (!enabled || hydrated.current) return;
    hydrated.current = true;

    themeService
      .get()
      .then((prefs) => {
        setTheme(MODE_FROM_SERVER[prefs.mode]);
        setAccent(ACCENT_FROM_SERVER[prefs.accent] as any);
      })
      .catch(() => {
        // No saved preference yet — keep whatever localStorage/default resolved to.
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !hydrated.current || !theme) return;
    themeService.update({ mode: MODE_TO_SERVER[theme] ?? 'SYSTEM' }).catch(() => {});
  }, [enabled, theme]);

  useEffect(() => {
    if (!enabled || !hydrated.current) return;
    themeService.update({ accent: ACCENT_TO_SERVER[accent] }).catch(() => {});
  }, [enabled, accent]);
}

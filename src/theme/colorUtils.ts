import type { AppTheme, ThemeColorToken } from './themeTypes';
import { sleekTokens } from './sleekTokens';

/**
 * Converts a 6-digit hex color + opacity (0–1) to an rgba() string.
 * Used throughout the app to replicate Tailwind's color/opacity modifier syntax
 * (e.g. primary/10 → alpha(primary, 0.10)).
 */
export function alpha(hex: string, opacity: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

export function themeColor(theme: AppTheme, token: ThemeColorToken): string {
  if (token === 'danger') {
    return theme.colors.danger;
  }

  return theme.colors[token];
}

// Design token base colors (from globals.css)
export const C = {
  primary: sleekTokens.colors.primary,
  secondary: sleekTokens.colors.secondary,
  accent: sleekTokens.colors.accent,
  muted: sleekTokens.colors.muted,
  mutedForeground: sleekTokens.colors.mutedForeground,
  border: sleekTokens.colors.border,
  background: sleekTokens.colors.background,
  foreground: sleekTokens.colors.foreground,
  destructive: sleekTokens.colors.destructive,
  card: sleekTokens.colors.card,
} as const;

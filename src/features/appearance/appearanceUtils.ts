import type { AppTheme } from '@/theme/themeTypes';
import { ACCENT_PRESETS, type AccentColourId } from './appearanceTypes';

export function getResolvedAccentHex(accentColourId: AccentColourId): string {
  return ACCENT_PRESETS.find((p) => p.id === accentColourId)?.hex ?? '#38BDF8';
}

export function applyAccentOverride(theme: AppTheme, accentColourId: AccentColourId): AppTheme {
  const hex = getResolvedAccentHex(accentColourId);
  // Short-circuit if accent matches the theme's own primary (no re-render cost)
  if (hex === theme.colors.primary) return theme;

  return {
    ...theme,
    colors: {
      ...theme.colors,
      primary: hex,
      ring: hex,
    },
    buttons: {
      ...theme.buttons,
      primary: {
        ...theme.buttons.primary,
        background: hex,
        border: hex,
      },
      ghost: {
        ...theme.buttons.ghost,
        text: hex,
      },
    },
  };
}

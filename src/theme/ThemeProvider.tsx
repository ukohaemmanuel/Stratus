import { createContext, type PropsWithChildren } from 'react';

import { useAppearanceStore } from '@/features/appearance/appearanceStore';
import { applyAccentOverride } from '@/features/appearance/appearanceUtils';

import { defaultThemeId, getThemeById } from './themes';
import type { AppTheme } from './themeTypes';

export const AppThemeContext = createContext<AppTheme>(getThemeById(defaultThemeId));

export function ThemeProvider({ children }: PropsWithChildren) {
  const selectedThemeId = useAppearanceStore((state) => state.selectedThemeId);
  const accentColourId  = useAppearanceStore((state) => state.accentColourId);
  const baseTheme       = getThemeById(selectedThemeId);
  const theme           = applyAccentOverride(baseTheme, accentColourId);

  return <AppThemeContext.Provider value={theme}>{children}</AppThemeContext.Provider>;
}

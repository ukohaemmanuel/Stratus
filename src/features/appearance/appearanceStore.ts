import { create } from 'zustand';

import { defaultThemeId } from '@/theme/themes';
import type { BackgroundMode, ThemeId } from '@/theme/themeTypes';

type AppearanceState = {
  selectedThemeId: ThemeId;
  setTheme: (themeId: ThemeId) => void;
  backgroundMode: BackgroundMode;
  setBackgroundMode: (backgroundMode: BackgroundMode) => void;
  customBackgroundUri?: string;
  setCustomBackgroundUri: (customBackgroundUri?: string) => void;
  overlayOpacity: number;
  setOverlayOpacity: (overlayOpacity: number) => void;
  resetAppearance: () => void;
};

const defaultAppearance = {
  selectedThemeId: defaultThemeId,
  backgroundMode: 'theme' as BackgroundMode,
  customBackgroundUri: undefined,
  overlayOpacity: 0.24,
};

export const useAppearanceStore = create<AppearanceState>((set) => ({
  ...defaultAppearance,
  setTheme: (selectedThemeId) => set({ selectedThemeId }),
  setBackgroundMode: (backgroundMode) => set({ backgroundMode }),
  setCustomBackgroundUri: (customBackgroundUri) => set({ customBackgroundUri }),
  setOverlayOpacity: (overlayOpacity) => set({ overlayOpacity }),
  resetAppearance: () => set(defaultAppearance),
}));

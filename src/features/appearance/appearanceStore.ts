import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/lib/storage/storageKeys';
import { sqliteStorage } from '@/lib/storage/sqliteStorage';
import { defaultThemeId } from '@/theme/themes';
import type { BackgroundMode, ThemeId } from '@/theme/themeTypes';
import type { AccentColourId } from './appearanceTypes';

type AppearanceState = {
  selectedThemeId: ThemeId;
  accentColourId: AccentColourId;
  backgroundMode: BackgroundMode;
  customBackgroundUri?: string | null;
  overlayOpacity: number;
  blurEnabled: boolean;
  _hasHydrated: boolean;

  setTheme: (themeId: ThemeId) => void;
  setAccentColour: (accentColourId: AccentColourId) => void;
  setBackgroundMode: (backgroundMode: BackgroundMode) => void;
  setCustomBackgroundUri: (customBackgroundUri?: string | null) => void;
  setOverlayOpacity: (overlayOpacity: number) => void;
  setBlurEnabled: (blurEnabled: boolean) => void;
  resetAppearance: () => void;
  setHasHydrated: (value: boolean) => void;
};

const defaultAppearance = {
  selectedThemeId: defaultThemeId,
  accentColourId: 'sky' as AccentColourId,
  backgroundMode: 'theme' as BackgroundMode,
  customBackgroundUri: undefined,
  overlayOpacity: 0.24,
  blurEnabled: false,
};

export const useAppearanceStore = create<AppearanceState>()(
  persist(
    (set) => ({
      ...defaultAppearance,
      _hasHydrated: false,

      setTheme:              (selectedThemeId)     => set({ selectedThemeId }),
      setAccentColour:       (accentColourId)      => set({ accentColourId }),
      setBackgroundMode:     (backgroundMode)      => set({ backgroundMode }),
      setCustomBackgroundUri:(customBackgroundUri) => set({ customBackgroundUri }),
      setOverlayOpacity:     (overlayOpacity)      => set({ overlayOpacity }),
      setBlurEnabled:        (blurEnabled)         => set({ blurEnabled }),
      resetAppearance:       ()                    => set(defaultAppearance),
      setHasHydrated:        (value)               => set({ _hasHydrated: value }),
    }),
    {
      name: STORAGE_KEYS.APPEARANCE,
      storage: createJSONStorage(() => sqliteStorage),
      partialize: (s) => ({
        selectedThemeId:     s.selectedThemeId,
        accentColourId:      s.accentColourId,
        backgroundMode:      s.backgroundMode,
        customBackgroundUri: s.customBackgroundUri,
        overlayOpacity:      s.overlayOpacity,
        blurEnabled:         s.blurEnabled,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

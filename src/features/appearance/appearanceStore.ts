import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/lib/storage/storageKeys';
import { sqliteStorage } from '@/lib/storage/sqliteStorage';
import { defaultThemeId } from '@/theme/themes';
import type { BackgroundMode, ThemeId } from '@/theme/themeTypes';

type AppearanceState = {
  selectedThemeId: ThemeId;
  backgroundMode: BackgroundMode;
  customBackgroundUri?: string;
  overlayOpacity: number;
  _hasHydrated: boolean;

  setTheme: (themeId: ThemeId) => void;
  setBackgroundMode: (backgroundMode: BackgroundMode) => void;
  setCustomBackgroundUri: (customBackgroundUri?: string) => void;
  setOverlayOpacity: (overlayOpacity: number) => void;
  resetAppearance: () => void;
  setHasHydrated: (value: boolean) => void;
};

const defaultAppearance = {
  selectedThemeId: defaultThemeId,
  backgroundMode: 'theme' as BackgroundMode,
  customBackgroundUri: undefined,
  overlayOpacity: 0.24,
};

export const useAppearanceStore = create<AppearanceState>()(
  persist(
    (set) => ({
      ...defaultAppearance,
      _hasHydrated: false,

      setTheme:              (selectedThemeId)    => set({ selectedThemeId }),
      setBackgroundMode:     (backgroundMode)     => set({ backgroundMode }),
      setCustomBackgroundUri:(customBackgroundUri)=> set({ customBackgroundUri }),
      setOverlayOpacity:     (overlayOpacity)     => set({ overlayOpacity }),
      resetAppearance:       ()                   => set(defaultAppearance),
      setHasHydrated:        (value)              => set({ _hasHydrated: value }),
    }),
    {
      name: STORAGE_KEYS.APPEARANCE,
      storage: createJSONStorage(() => sqliteStorage),
      partialize: (s) => ({
        selectedThemeId:    s.selectedThemeId,
        backgroundMode:     s.backgroundMode,
        customBackgroundUri:s.customBackgroundUri,
        overlayOpacity:     s.overlayOpacity,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

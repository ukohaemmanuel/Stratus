import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/lib/storage/storageKeys';
import { sqliteStorage } from '@/lib/storage/sqliteStorage';
import type { TemperatureUnit } from '@/utils/temperature';

type PreferencesState = {
  temperatureUnit: TemperatureUnit;
  weatherTone: 'playful' | 'simple';
  hapticsEnabled: boolean;
  useCurrentLocation: boolean;
  _hasHydrated: boolean;

  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setWeatherTone: (tone: 'playful' | 'simple') => void;
  setHapticsEnabled: (enabled: boolean) => void;
  setUseCurrentLocation: (enabled: boolean) => void;
  resetPreferences: () => void;
  setHasHydrated: (value: boolean) => void;
};

const defaults = {
  temperatureUnit: 'celsius' as TemperatureUnit,
  weatherTone: 'playful' as const,
  hapticsEnabled: true,
  useCurrentLocation: true,
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      ...defaults,
      _hasHydrated: false,

      setTemperatureUnit:    (unit)    => set({ temperatureUnit: unit }),
      setWeatherTone:        (tone)    => set({ weatherTone: tone }),
      setHapticsEnabled:     (enabled) => set({ hapticsEnabled: enabled }),
      setUseCurrentLocation: (enabled) => set({ useCurrentLocation: enabled }),
      resetPreferences:      ()        => set(defaults),
      setHasHydrated:        (value)   => set({ _hasHydrated: value }),
    }),
    {
      name: STORAGE_KEYS.PREFERENCES,
      storage: createJSONStorage(() => sqliteStorage),
      partialize: (s) => ({
        temperatureUnit:    s.temperatureUnit,
        weatherTone:        s.weatherTone,
        hapticsEnabled:     s.hapticsEnabled,
        useCurrentLocation: s.useCurrentLocation,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

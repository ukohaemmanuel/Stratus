import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/lib/storage/storageKeys';
import { sqliteStorage } from '@/lib/storage/sqliteStorage';
import type { CityResult } from '@/services/weather/weatherTypes';

const DEFAULT_PLACES: CityResult[] = [
  { id: 'newcastle',  name: 'Newcastle',  country: 'United Kingdom', region: 'England',        latitude: 54.978,  longitude: -1.618, timezone: 'Europe/London'  },
  { id: 'london',     name: 'London',     country: 'United Kingdom', region: 'England',        latitude: 51.507,  longitude: -0.127, timezone: 'Europe/London'  },
  { id: 'manchester', name: 'Manchester', country: 'United Kingdom', region: 'England',        latitude: 53.483,  longitude: -2.244, timezone: 'Europe/London'  },
  { id: 'lagos',      name: 'Lagos',      country: 'Nigeria',        region: 'Lagos',          latitude: 6.455,   longitude: 3.384,  timezone: 'Africa/Lagos'   },
  { id: 'paris',      name: 'Paris',      country: 'France',         region: 'Île-de-France',  latitude: 48.853,  longitude: 2.350,  timezone: 'Europe/Paris'   },
];

type PlacesState = {
  savedPlaces: CityResult[];
  _hasHydrated: boolean;

  addPlace: (city: CityResult) => void;
  removePlace: (id: string) => void;
  isSaved: (id: string) => boolean;
  clearPlaces: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const usePlacesStore = create<PlacesState>()(
  persist(
    (set, get) => ({
      savedPlaces: [],
      _hasHydrated: false,

      addPlace: (city) => {
        const existing = get().savedPlaces;
        const duplicate = existing.some(
          (p) =>
            p.id === city.id ||
            (Math.abs(p.latitude - city.latitude) < 0.01 &&
              Math.abs(p.longitude - city.longitude) < 0.01)
        );
        if (!duplicate) {
          set({ savedPlaces: [city, ...existing] });
        }
      },

      removePlace: (id) =>
        set((s) => ({ savedPlaces: s.savedPlaces.filter((p) => p.id !== id) })),

      isSaved: (id) => get().savedPlaces.some((p) => p.id === id),

      clearPlaces: () => set({ savedPlaces: [] }),

      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: STORAGE_KEYS.PLACES,
      storage: createJSONStorage(() => sqliteStorage),
      partialize: (s) => ({ savedPlaces: s.savedPlaces }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Populate defaults on first run (empty savedPlaces after rehydration)
          if (state.savedPlaces.length === 0) {
            state.savedPlaces = DEFAULT_PLACES;
          }
          state.setHasHydrated(true);
        }
      },
    }
  )
);

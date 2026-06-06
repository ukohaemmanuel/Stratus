import * as Location from 'expo-location';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/lib/storage/storageKeys';
import { sqliteStorage } from '@/lib/storage/sqliteStorage';
import { searchCities, getWeatherForCoordinates } from '@/services/weather/weatherService';
import type { CityResult, WeatherPayload } from '@/services/weather/weatherTypes';
import { loadWeatherCache, saveWeatherCache } from './weatherCache';

type WeatherState = {
  currentPayload: WeatherPayload | null;
  selectedLocation: CityResult | null;   // persisted — restored on startup
  searchResults: CityResult[];
  recentSearches: string[];
  selectedDayIndex: number | null;
  isLoadingCurrent: boolean;
  isLoadingSearch: boolean;
  error: string | null;
  _hasHydrated: boolean;

  fetchWeatherForCurrentLocation: () => Promise<void>;
  fetchWeatherForCity: (city: CityResult) => Promise<void>;
  loadCachedWeather: (locationId: string) => Promise<void>;
  searchCity: (query: string) => Promise<void>;
  clearSearch: () => void;
  setSelectedDay: (index: number | null) => void;
  setSelectedLocation: (city: CityResult | null) => void;
  addRecentSearch: (name: string) => void;
  clearError: () => void;
  setHasHydrated: (value: boolean) => void;
};

const initialState = {
  currentPayload:   null,
  selectedLocation: null,
  searchResults:    [] as CityResult[],
  recentSearches:   [] as string[],
  selectedDayIndex: null,
  isLoadingCurrent: false,
  isLoadingSearch:  false,
  error:            null,
};

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set, get) => ({
      ...initialState,
      _hasHydrated: false,

      fetchWeatherForCurrentLocation: async () => {
        set({ isLoadingCurrent: true, error: null });
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            set({ isLoadingCurrent: false, error: 'Location permission denied' });
            return;
          }

          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          const { latitude, longitude } = loc.coords;

          let cityName = 'Your Location';
          try {
            const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
            cityName = place?.city ?? place?.district ?? place?.region ?? place?.name ?? 'Your Location';
          } catch {
            // Non-fatal
          }

          const payload = await getWeatherForCoordinates(latitude, longitude, cityName);
          const payloadWithCity: WeatherPayload = {
            ...payload,
            city: { ...payload.city, id: 'current-location', name: cityName },
          };
          await saveWeatherCache('current-location', payloadWithCity);
          set({
            currentPayload:   payloadWithCity,
            selectedLocation: payloadWithCity.city,
            isLoadingCurrent: false,
            error:            null,
          });
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Failed to load weather';
          set({ isLoadingCurrent: false, error: message });
        }
      },

      fetchWeatherForCity: async (city: CityResult) => {
        set({ isLoadingCurrent: true, error: null });
        try {
          const payload = await getWeatherForCoordinates(city.latitude, city.longitude, city.name);
          const payloadWithCity: WeatherPayload = { ...payload, city };
          await saveWeatherCache(city.id, payloadWithCity);
          set({
            currentPayload:   payloadWithCity,
            selectedLocation: city,
            isLoadingCurrent: false,
            error:            null,
          });
        } catch (e) {
          const message = e instanceof Error ? e.message : 'Failed to load weather';
          set({ isLoadingCurrent: false, error: message });
        }
      },

      loadCachedWeather: async (locationId: string) => {
        const cached = await loadWeatherCache(locationId);
        if (cached) {
          set({ currentPayload: cached });
        }
      },

      searchCity: async (query: string) => {
        if (query.trim().length < 2) {
          set({ searchResults: [] });
          return;
        }
        set({ isLoadingSearch: true });
        try {
          const results = await searchCities(query);
          set({ searchResults: results, isLoadingSearch: false });
        } catch {
          set({ searchResults: [], isLoadingSearch: false });
        }
      },

      clearSearch: () => set({ searchResults: [] }),

      setSelectedDay: (index) => set({ selectedDayIndex: index }),

      setSelectedLocation: (city) => set({ selectedLocation: city }),

      addRecentSearch: (name) => {
        const prev = get().recentSearches;
        const updated = [name, ...prev.filter((s) => s !== name)].slice(0, 5);
        set({ recentSearches: updated });
      },

      clearError: () => set({ error: null }),

      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: STORAGE_KEYS.WEATHER,
      storage: createJSONStorage(() => sqliteStorage),
      partialize: (s) => ({
        selectedLocation: s.selectedLocation,
        recentSearches:   s.recentSearches,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

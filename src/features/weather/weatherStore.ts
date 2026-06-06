import * as Location from 'expo-location';
import { create } from 'zustand';

import { searchCities, getWeatherForCoordinates } from '@/services/weather/weatherService';
import type { CityResult, WeatherPayload } from '@/services/weather/weatherTypes';

type WeatherState = {
  currentPayload: WeatherPayload | null;
  searchResults: CityResult[];
  recentSearches: string[];
  selectedDayIndex: number | null; // null = today view
  isLoadingCurrent: boolean;
  isLoadingSearch: boolean;
  error: string | null;

  fetchWeatherForCurrentLocation: () => Promise<void>;
  fetchWeatherForCity: (city: CityResult) => Promise<void>;
  searchCity: (query: string) => Promise<void>;
  clearSearch: () => void;
  setSelectedDay: (index: number | null) => void;
  addRecentSearch: (name: string) => void;
  clearError: () => void;
};

const initialState = {
  currentPayload: null,
  searchResults: [] as CityResult[],
  recentSearches: [] as string[],
  selectedDayIndex: null,
  isLoadingCurrent: false,
  isLoadingSearch: false,
  error: null,
};

export const useWeatherStore = create<WeatherState>((set, get) => ({
  ...initialState,

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

      // Best-effort reverse geocode for a city name
      let cityName = 'Your Location';
      try {
        const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
        cityName = place?.city ?? place?.district ?? place?.region ?? place?.name ?? 'Your Location';
      } catch {
        // Non-fatal — keep default city name
      }

      const payload = await getWeatherForCoordinates(latitude, longitude, cityName);
      // Stamp the city id so it's recognisable
      const payloadWithCity: WeatherPayload = {
        ...payload,
        city: { ...payload.city, id: 'current-location', name: cityName },
      };
      set({ currentPayload: payloadWithCity, isLoadingCurrent: false, error: null });
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
      set({ currentPayload: payloadWithCity, isLoadingCurrent: false, error: null });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load weather';
      set({ isLoadingCurrent: false, error: message });
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

  setSelectedDay: (index: number | null) => set({ selectedDayIndex: index }),

  addRecentSearch: (name: string) => {
    const prev = get().recentSearches;
    const updated = [name, ...prev.filter(s => s !== name)].slice(0, 5);
    set({ recentSearches: updated });
  },

  clearError: () => set({ error: null }),
}));

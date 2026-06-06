import type { IconKey } from '../assets/icons';
import type { ThemeColorToken } from '@/theme';

export type MockPlace = {
  id: string;
  city: string;
  region: string;
  temperature: number;
  condition: string;
  icon: IconKey;
  iconColor: ThemeColorToken;
  weatherMood: string;
  rainChance: number;
  wind: string;
  latitude: number;
  longitude: number;
  isCurrent: boolean;
};

export type SearchResult = {
  id: string;
  city: string;
  country: string;
  temperature: number;
  icon: IconKey;
  iconColor: ThemeColorToken;
};

export const mockPlaces: MockPlace[] = [
  {
    id: 'newcastle',
    city: 'Newcastle',
    region: 'United Kingdom',
    temperature: 12,
    condition: 'Cloudy',
    icon: 'cloudsBold',
    iconColor: 'primary',
    weatherMood: 'Soft cloudy morning',
    rainChance: 40,
    wind: '12 mph',
    latitude: 54.9783,
    longitude: -1.6178,
    isCurrent: true,
  },
  {
    id: 'london',
    city: 'London',
    region: 'United Kingdom',
    temperature: 18,
    condition: 'Bright spells',
    icon: 'sunBold',
    iconColor: 'secondary',
    weatherMood: 'Sunny little win',
    rainChance: 0,
    wind: '8 mph',
    latitude: 51.5072,
    longitude: -0.1276,
    isCurrent: false,
  },
  {
    id: 'paris',
    city: 'Paris',
    region: 'France',
    temperature: 16,
    condition: 'Rainy evening',
    icon: 'cloudRainBold',
    iconColor: 'accent',
    weatherMood: 'Rainy evening',
    rainChance: 85,
    wind: '6 mph',
    latitude: 48.8566,
    longitude: 2.3522,
    isCurrent: false,
  },
  {
    id: 'lagos',
    city: 'Lagos',
    region: 'Nigeria',
    temperature: 31,
    condition: 'Sunny',
    icon: 'sunBold',
    iconColor: 'secondary',
    weatherMood: 'Golden hour mode',
    rainChance: 0,
    wind: '7 mph',
    latitude: 6.5244,
    longitude: 3.3792,
    isCurrent: false,
  },
];

export const searchResults: SearchResult[] = [
  {
    id: 'search-paris',
    city: 'Paris',
    country: 'France',
    temperature: 16,
    icon: 'cloudRainBold' as IconKey,
    iconColor: 'accent',
  },
  {
    id: 'search-lagos',
    city: 'Lagos',
    country: 'Nigeria',
    temperature: 31,
    icon: 'sunBold' as IconKey,
    iconColor: 'secondary',
  },
];

export const recentSearches = ['London', 'San Francisco'];

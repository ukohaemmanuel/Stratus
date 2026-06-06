import { STORAGE_KEYS } from '@/lib/storage/storageKeys';
import { sqliteStorage } from '@/lib/storage/sqliteStorage';
import type { WeatherPayload } from '@/services/weather/weatherTypes';

const STALE_MS = 2 * 60 * 60 * 1000; // 2 hours

export const STALE_MESSAGE = 'Showing saved weather. Pull to refresh when online.';

type CachedEntry = {
  payload: WeatherPayload;
  cachedAt: number;
};

export async function saveWeatherCache(
  locationId: string,
  payload: WeatherPayload
): Promise<void> {
  const entry: CachedEntry = { payload, cachedAt: Date.now() };
  await sqliteStorage.setItem(STORAGE_KEYS.weatherCache(locationId), JSON.stringify(entry));
}

export async function loadWeatherCache(
  locationId: string
): Promise<WeatherPayload | null> {
  try {
    const raw = await sqliteStorage.getItem(STORAGE_KEYS.weatherCache(locationId));
    if (!raw) return null;
    const entry: CachedEntry = JSON.parse(raw);
    return entry.payload ?? null;
  } catch {
    return null;
  }
}

export async function isWeatherCacheStale(locationId: string): Promise<boolean> {
  try {
    const raw = await sqliteStorage.getItem(STORAGE_KEYS.weatherCache(locationId));
    if (!raw) return true;
    const entry: CachedEntry = JSON.parse(raw);
    return Date.now() - entry.cachedAt > STALE_MS;
  } catch {
    return true;
  }
}

export async function clearWeatherCache(locationId: string): Promise<void> {
  await sqliteStorage.removeItem(STORAGE_KEYS.weatherCache(locationId));
}

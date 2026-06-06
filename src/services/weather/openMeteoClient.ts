import {
  RawForecastResponseSchema,
  RawGeocodingResponseSchema,
  type RawForecastResponse,
  type RawGeocodingResponse,
} from './weatherTypes';

const FORECAST_BASE  = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_BASE = 'https://geocoding-api.open-meteo.com/v1/search';

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchGeocodingRaw(
  query: string,
  count = 10
): Promise<RawGeocodingResponse> {
  const params = new URLSearchParams({
    name: query,
    count: String(count),
    language: 'en',
    format: 'json',
  });
  const response = await fetchWithTimeout(`${GEOCODING_BASE}?${params}`, 10_000);
  if (!response.ok) {
    throw new Error(`Geocoding fetch failed: ${response.status}`);
  }
  const json = await response.json();
  return RawGeocodingResponseSchema.parse(json);
}

export async function fetchForecastRaw(
  latitude: number,
  longitude: number
): Promise<RawForecastResponse> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: [
      'temperature_2m',
      'apparent_temperature',
      'weathercode',
      'windspeed_10m',
      'relativehumidity_2m',
      'is_day',
      'uv_index',
    ].join(','),
    hourly: [
      'temperature_2m',
      'weathercode',
      'precipitation_probability',
      'apparent_temperature',
      'uv_index',
    ].join(','),
    daily: [
      'weathercode',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'uv_index_max',
      'windspeed_10m_max',
    ].join(','),
    forecast_days: '16',
    timezone: 'auto',
    wind_speed_unit: 'mph',
    temperature_unit: 'celsius',
  });
  const response = await fetchWithTimeout(`${FORECAST_BASE}?${params}`, 15_000);
  if (!response.ok) {
    throw new Error(`Forecast fetch failed: ${response.status}`);
  }
  const json = await response.json();
  return RawForecastResponseSchema.parse(json);
}

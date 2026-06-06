import { fetchForecastRaw, fetchGeocodingRaw } from './openMeteoClient';
import type {
  CityResult,
  CurrentConditions,
  DailySlice,
  HourlySlice,
  WeatherPayload,
} from './weatherTypes';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extract the two-digit hour from an Open-Meteo time string like "2024-06-06T14:00". */
function extractHour(isoTime: string): number {
  const match = /T(\d{2}):/.exec(isoTime);
  return match ? parseInt(match[1], 10) : 0;
}

/** Format a raw hour integer (0–23) to "2 PM" / "11 AM" style. */
function formatHour(rawHour: number): string {
  if (rawHour === 0) return '12 AM';
  if (rawHour < 12) return `${rawHour} AM`;
  if (rawHour === 12) return '12 PM';
  return `${rawHour - 12} PM`;
}

// ---------------------------------------------------------------------------
// Public: geocoding
// ---------------------------------------------------------------------------

export async function searchCities(query: string): Promise<CityResult[]> {
  if (query.trim().length < 2) return [];
  const raw = await fetchGeocodingRaw(query, 10);
  if (!raw.results || raw.results.length === 0) return [];
  return raw.results.map(r => ({
    id: String(r.id),
    name: r.name,
    country: r.country ?? '',
    region: r.admin1 ?? r.country ?? '',
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone ?? 'auto',
  }));
}

// ---------------------------------------------------------------------------
// Public: forecast
// ---------------------------------------------------------------------------

export async function getWeatherForCoordinates(
  latitude: number,
  longitude: number,
  cityName: string
): Promise<WeatherPayload> {
  const raw = await fetchForecastRaw(latitude, longitude);

  // Find the index in hourly.time[] that matches the current local hour.
  // Open-Meteo hourly times are local — no timezone suffix — so we use the
  // current device hour as a proxy rather than parsing as Date (UTC risk).
  const deviceHour = new Date().getHours();
  const todayPrefix = new Date().toISOString().slice(0, 10); // "2024-06-06"
  let currentHourIndex = raw.hourly.time.findIndex(t => {
    const dateMatch = t.startsWith(todayPrefix);
    const hourMatch = extractHour(t) === deviceHour;
    return dateMatch && hourMatch;
  });
  if (currentHourIndex === -1) currentHourIndex = 0;

  // Current conditions (precipitation_probability comes from hourly, not current)
  const current: CurrentConditions = {
    temperature: Math.round(raw.current.temperature_2m),
    feelsLike: Math.round(raw.current.apparent_temperature),
    weatherCode: raw.current.weathercode,
    windSpeed: Math.round(raw.current.windspeed_10m),
    humidity: Math.round(raw.current.relativehumidity_2m),
    rainProbability: raw.hourly.precipitation_probability[currentHourIndex] ?? 0,
    uvIndex: raw.current.uv_index ?? 0,
    isDay: raw.current.is_day === 1,
  };

  // Hourly: next 12 slots from the current hour index
  const hourlySlots = raw.hourly.time.slice(
    currentHourIndex,
    currentHourIndex + 12
  );
  const hourly: HourlySlice[] = hourlySlots.map((isoTime, i) => ({
    isoTime,
    hour: i === 0 ? 'Now' : formatHour(extractHour(isoTime)),
    temperature: Math.round(raw.hourly.temperature_2m[currentHourIndex + i] ?? 0),
    weatherCode: raw.hourly.weathercode[currentHourIndex + i] ?? raw.current.weathercode,
    rainChance: raw.hourly.precipitation_probability[currentHourIndex + i] ?? 0,
  }));

  // Daily: days 0–6
  const daily: DailySlice[] = raw.daily.time.slice(0, 7).map((isoDate, i) => ({
    isoDate,
    weatherCode: raw.daily.weathercode[i] ?? 3,
    highTemp: Math.round(raw.daily.temperature_2m_max[i] ?? 0),
    lowTemp: Math.round(raw.daily.temperature_2m_min[i] ?? 0),
    rainChance: raw.daily.precipitation_probability_max[i] ?? 0,
    uvIndexMax: raw.daily.uv_index_max[i] ?? 0,
    windSpeedMax: Math.round(raw.daily.windspeed_10m_max[i] ?? 0),
  }));

  // Outlook: days 7–15 (guard: only if API returned enough entries)
  const outlook: DailySlice[] = raw.daily.time.length >= 8
    ? raw.daily.time.slice(7, 16).map((isoDate, i) => ({
        isoDate,
        weatherCode: raw.daily.weathercode[7 + i] ?? 3,
        highTemp: Math.round(raw.daily.temperature_2m_max[7 + i] ?? 0),
        lowTemp: Math.round(raw.daily.temperature_2m_min[7 + i] ?? 0),
        rainChance: raw.daily.precipitation_probability_max[7 + i] ?? 0,
        uvIndexMax: raw.daily.uv_index_max[7 + i] ?? 0,
        windSpeedMax: Math.round(raw.daily.windspeed_10m_max[7 + i] ?? 0),
      }))
    : [];

  const city: CityResult = {
    id: 'fetched',
    name: cityName,
    country: '',
    region: '',
    latitude,
    longitude,
    timezone: 'auto',
  };

  return { city, current, hourly, daily, outlook, fetchedAt: Date.now() };
}

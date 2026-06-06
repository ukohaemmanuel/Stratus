import { z } from 'zod';

// ---------------------------------------------------------------------------
// Zod schemas — used only in openMeteoClient for runtime validation
// ---------------------------------------------------------------------------

export const GeocodingResultSchema = z.object({
  id: z.number(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  country: z.string().optional().default(''),
  country_code: z.string().optional().default(''),
  admin1: z.string().optional(),
  admin2: z.string().optional(),
  timezone: z.string().optional().default('auto'),
});

export const RawGeocodingResponseSchema = z.object({
  results: z.array(GeocodingResultSchema).optional(),
});

export const RawForecastResponseSchema = z.object({
  current: z.object({
    temperature_2m: z.number(),
    apparent_temperature: z.number(),
    weathercode: z.number(),
    windspeed_10m: z.number(),
    relativehumidity_2m: z.number(),
    is_day: z.number(),
    uv_index: z.number().optional().default(0),
  }),
  hourly: z.object({
    time: z.array(z.string()),
    temperature_2m: z.array(z.number()),
    weathercode: z.array(z.number()),
    precipitation_probability: z.array(z.number().nullable()).transform(arr =>
      arr.map(v => v ?? 0)
    ),
    apparent_temperature: z.array(z.number()),
    uv_index: z.array(z.number().nullable()).transform(arr =>
      arr.map(v => v ?? 0)
    ),
  }),
  daily: z.object({
    time: z.array(z.string()),
    weathercode: z.array(z.number()),
    temperature_2m_max: z.array(z.number()),
    temperature_2m_min: z.array(z.number()),
    precipitation_probability_max: z.array(z.number().nullable()).transform(arr =>
      arr.map(v => v ?? 0)
    ),
    uv_index_max: z.array(z.number().nullable()).transform(arr =>
      arr.map(v => v ?? 0)
    ),
    windspeed_10m_max: z.array(z.number().nullable()).transform(arr =>
      arr.map(v => v ?? 0)
    ),
  }),
});

// ---------------------------------------------------------------------------
// Inferred raw types
// ---------------------------------------------------------------------------

export type RawGeocodingResponse = z.infer<typeof RawGeocodingResponseSchema>;
export type RawGeocodingResult   = z.infer<typeof GeocodingResultSchema>;
export type RawForecastResponse  = z.infer<typeof RawForecastResponseSchema>;

// ---------------------------------------------------------------------------
// Domain models (post-processing)
// ---------------------------------------------------------------------------

export type CityResult = {
  id: string;
  name: string;
  country: string;
  region: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

export type CurrentConditions = {
  temperature: number;
  feelsLike: number;
  weatherCode: number;
  windSpeed: number;
  humidity: number;
  rainProbability: number; // sourced from hourly[currentHourIndex]
  uvIndex: number;
  isDay: boolean;
};

export type HourlySlice = {
  isoTime: string;
  hour: string;       // "Now" | "2 PM" | "11 AM"
  temperature: number;
  weatherCode: number;
  rainChance: number;
};

export type DailySlice = {
  isoDate: string;
  weatherCode: number;
  highTemp: number;
  lowTemp: number;
  rainChance: number;
  uvIndexMax: number;
  windSpeedMax: number;
};

export type WeatherPayload = {
  city: CityResult;
  current: CurrentConditions;
  hourly: HourlySlice[];   // next ~12 slots from current hour
  daily: DailySlice[];     // days 0–6
  outlook: DailySlice[];   // days 7–15
  fetchedAt: number;
};

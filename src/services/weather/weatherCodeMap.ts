import type { IconKey } from '@/assets/icons';
import type { ThemeColorToken } from '@/theme';

export type WeatherCodeMapping = {
  conditionLabel: string;
  iconKey: IconKey;
  iconColor: ThemeColorToken;
  weatherMood: string;
  simpleToneLabel: string;
  labelColor: 'primary' | 'accent' | 'secondary' | 'muted';
};

const map: Record<number, WeatherCodeMapping> = {
  0: {
    conditionLabel: 'Clear sky',
    iconKey: 'sunBold',
    iconColor: 'secondary',
    weatherMood: 'Golden hour mode',
    simpleToneLabel: 'Sunny little win',
    labelColor: 'primary',
  },
  1: {
    conditionLabel: 'Mainly clear',
    iconKey: 'sunBold',
    iconColor: 'secondary',
    weatherMood: 'Mostly sunny',
    simpleToneLabel: 'Clear and bright',
    labelColor: 'primary',
  },
  2: {
    conditionLabel: 'Partly cloudy',
    iconKey: 'cloudSunBold',
    iconColor: 'primary',
    weatherMood: 'Soft sky day',
    simpleToneLabel: 'Soft sky day',
    labelColor: 'primary',
  },
  3: {
    conditionLabel: 'Overcast',
    iconKey: 'cloudsBold',
    iconColor: 'primary',
    weatherMood: 'Soft cloudy morning',
    simpleToneLabel: 'Cloudy reset day',
    labelColor: 'muted',
  },
  45: {
    conditionLabel: 'Foggy',
    iconKey: 'sunFogBold',
    iconColor: 'mutedText',
    weatherMood: 'Hazy and still',
    simpleToneLabel: 'Foggy mood',
    labelColor: 'muted',
  },
  48: {
    conditionLabel: 'Icy fog',
    iconKey: 'sunFogBold',
    iconColor: 'mutedText',
    weatherMood: 'Freezing fog',
    simpleToneLabel: 'Frosty haze',
    labelColor: 'muted',
  },
  51: {
    conditionLabel: 'Light drizzle',
    iconKey: 'cloudRainBold',
    iconColor: 'accent',
    weatherMood: 'Drizzle day',
    simpleToneLabel: 'Light drizzle',
    labelColor: 'accent',
  },
  53: {
    conditionLabel: 'Drizzle',
    iconKey: 'cloudRainBold',
    iconColor: 'accent',
    weatherMood: 'Drizzle day',
    simpleToneLabel: 'Drizzle mode',
    labelColor: 'accent',
  },
  55: {
    conditionLabel: 'Dense drizzle',
    iconKey: 'cloudRainBold',
    iconColor: 'accent',
    weatherMood: 'Heavy drizzle',
    simpleToneLabel: 'Wet and grey',
    labelColor: 'accent',
  },
  56: {
    conditionLabel: 'Freezing drizzle',
    iconKey: 'cloudRainBold',
    iconColor: 'accent',
    weatherMood: 'Icy drizzle',
    simpleToneLabel: 'Freezing drizzle',
    labelColor: 'accent',
  },
  57: {
    conditionLabel: 'Heavy freezing drizzle',
    iconKey: 'cloudRainBold',
    iconColor: 'danger',
    weatherMood: 'Dangerous drizzle',
    simpleToneLabel: 'Stay inside',
    labelColor: 'accent',
  },
  61: {
    conditionLabel: 'Light rain',
    iconKey: 'cloudRainBold',
    iconColor: 'accent',
    weatherMood: 'Rainy afternoon',
    simpleToneLabel: 'Light rain',
    labelColor: 'accent',
  },
  63: {
    conditionLabel: 'Rain',
    iconKey: 'cloudRainBold',
    iconColor: 'accent',
    weatherMood: 'Rainy evening',
    simpleToneLabel: 'Rainy evening',
    labelColor: 'accent',
  },
  65: {
    conditionLabel: 'Heavy rain',
    iconKey: 'cloudRainBold',
    iconColor: 'danger',
    weatherMood: 'Heavy downpour',
    simpleToneLabel: 'Soak warning',
    labelColor: 'accent',
  },
  66: {
    conditionLabel: 'Freezing rain',
    iconKey: 'cloudRainBold',
    iconColor: 'accent',
    weatherMood: 'Slippery conditions',
    simpleToneLabel: 'Ice rain',
    labelColor: 'accent',
  },
  67: {
    conditionLabel: 'Heavy freezing rain',
    iconKey: 'cloudRainBold',
    iconColor: 'danger',
    weatherMood: 'Dangerous ice rain',
    simpleToneLabel: 'Stay inside',
    labelColor: 'accent',
  },
  71: {
    conditionLabel: 'Light snow',
    iconKey: 'waterdropBold',
    iconColor: 'primary',
    weatherMood: 'Snowy vibes',
    simpleToneLabel: 'Light snow',
    labelColor: 'muted',
  },
  73: {
    conditionLabel: 'Snow',
    iconKey: 'waterdropBold',
    iconColor: 'primary',
    weatherMood: 'Snow day',
    simpleToneLabel: 'Snow day',
    labelColor: 'muted',
  },
  75: {
    conditionLabel: 'Heavy snow',
    iconKey: 'waterdropBold',
    iconColor: 'primary',
    weatherMood: 'Blizzard warning',
    simpleToneLabel: 'Blizzard',
    labelColor: 'muted',
  },
  77: {
    conditionLabel: 'Snow grains',
    iconKey: 'waterdropBold',
    iconColor: 'mutedText',
    weatherMood: 'Grainy snow',
    simpleToneLabel: 'Grainy conditions',
    labelColor: 'muted',
  },
  80: {
    conditionLabel: 'Light showers',
    iconKey: 'cloudRainBold',
    iconColor: 'accent',
    weatherMood: 'Showery spells',
    simpleToneLabel: 'Showery spells',
    labelColor: 'accent',
  },
  81: {
    conditionLabel: 'Showers',
    iconKey: 'cloudRainBold',
    iconColor: 'accent',
    weatherMood: 'On and off rain',
    simpleToneLabel: 'Showers',
    labelColor: 'accent',
  },
  82: {
    conditionLabel: 'Heavy showers',
    iconKey: 'cloudRainBold',
    iconColor: 'danger',
    weatherMood: 'Heavy showers',
    simpleToneLabel: 'Heavy showers',
    labelColor: 'accent',
  },
  85: {
    conditionLabel: 'Snow showers',
    iconKey: 'waterdropBold',
    iconColor: 'primary',
    weatherMood: 'Snow showers',
    simpleToneLabel: 'Snow showers',
    labelColor: 'muted',
  },
  86: {
    conditionLabel: 'Heavy snow showers',
    iconKey: 'waterdropBold',
    iconColor: 'primary',
    weatherMood: 'Heavy snow',
    simpleToneLabel: 'Heavy snow',
    labelColor: 'muted',
  },
  95: {
    conditionLabel: 'Thunderstorm',
    iconKey: 'cloudLightning',
    iconColor: 'danger',
    weatherMood: 'Stormy battle',
    simpleToneLabel: 'Stormy boss',
    labelColor: 'accent',
  },
  96: {
    conditionLabel: 'Thunderstorm with hail',
    iconKey: 'cloudLightning',
    iconColor: 'danger',
    weatherMood: 'Storm and hail',
    simpleToneLabel: 'Hailstorm',
    labelColor: 'accent',
  },
  99: {
    conditionLabel: 'Severe thunderstorm',
    iconKey: 'cloudLightning',
    iconColor: 'danger',
    weatherMood: 'Severe storm',
    simpleToneLabel: 'Severe storm',
    labelColor: 'accent',
  },
};

const FALLBACK: WeatherCodeMapping = map[3];

export function getWeatherCodeMapping(code: number): WeatherCodeMapping {
  return map[code] ?? FALLBACK;
}

import type { IconKey } from '@/assets/icons';
import type { ThemeColorToken } from '@/theme';
import type {
  EssentialData,
  ForecastDay,
  HourlyForecast,
  OutlookDay,
  ShouldICardData,
} from '@/data/mockWeather';
import { getWeatherCodeMapping } from '@/services/weather/weatherCodeMap';
import type { CurrentConditions, DailySlice, HourlySlice, WeatherPayload } from '@/services/weather/weatherTypes';

export { getWeatherCodeMapping };

// ---------------------------------------------------------------------------
// Mood
// ---------------------------------------------------------------------------

export function getWeatherMood(
  code: number,
  isDay: boolean,
  temp: number
): string {
  if ((code === 0 || code === 1) && !isDay) return 'Starry night';
  if ((code === 0 || code === 1) && isDay && temp > 28) return 'Scorching sun day';
  return getWeatherCodeMapping(code).weatherMood;
}

// ---------------------------------------------------------------------------
// Comfort score (0–100, clamped to 10–98)
// ---------------------------------------------------------------------------

export function getComfortScore(current: CurrentConditions): number {
  let score = 75;

  const t = current.temperature;
  if (t >= 18 && t <= 24) score += 15;
  else if ((t >= 15 && t < 18) || (t > 24 && t <= 27)) score += 5;
  else if ((t >= 10 && t < 15) || (t > 27 && t <= 32)) score -= 10;
  else score -= 20;

  const r = current.rainProbability;
  if (r <= 20) score += 0;
  else if (r <= 50) score -= 10;
  else if (r <= 80) score -= 20;
  else score -= 30;

  const w = current.windSpeed;
  if (w < 10) score += 0;
  else if (w <= 20) score -= 5;
  else if (w <= 35) score -= 10;
  else score -= 20;

  if (current.uvIndex >= 7) score -= 5;

  const h = current.humidity;
  if (h >= 30 && h <= 60) score += 0;
  else if (h <= 75) score -= 5;
  else score -= 10;
  if (h < 30) score -= 5;

  return Math.max(10, Math.min(98, score));
}

// ---------------------------------------------------------------------------
// Comfort description
// ---------------------------------------------------------------------------

export function getComfortDescription(
  score: number,
  current: CurrentConditions
): string {
  const windCaveat = current.windSpeed > 20 ? ', but slightly windy' : '';
  const rainCaveat = current.rainProbability > 50 ? ', but rain likely later' : '';

  if (score >= 85) return 'Perfect conditions. Enjoy your day!';
  if (score >= 70) return `Nice overall${windCaveat}${rainCaveat}.`;
  if (score >= 55) {
    if (current.temperature < 12) return 'A bit cold today. Layer up.';
    if (current.temperature > 28) return 'A bit warm today. Stay hydrated.';
    if (current.rainProbability > 50) return 'A bit wet today. Grab a cover.';
    return `Manageable out there${windCaveat}.`;
  }
  if (score >= 40) return 'Challenging weather. Dress for it.';
  return 'Rough day out there. Stay cosy.';
}

// ---------------------------------------------------------------------------
// Greeting
// ---------------------------------------------------------------------------

export function getGreeting(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Good morning';
  if (h >= 12 && h < 18) return 'Good afternoon';
  if (h >= 18 && h < 22) return 'Good evening';
  return 'Good night';
}

// ---------------------------------------------------------------------------
// Essentials
// ---------------------------------------------------------------------------

export function getEssentials(current: CurrentConditions): EssentialData[] {
  const items: EssentialData[] = [];

  // Temperature layer (always first)
  if (current.temperature < 10) {
    items.push({ label: 'Warm coat', icon: 'tShirtBold', iconColor: 'primary' });
  } else if (current.temperature < 16) {
    items.push({ label: 'Light layer', icon: 'tShirtBold', iconColor: 'primary' });
  } else if (current.temperature <= 22) {
    items.push({ label: 'T-shirt weather', icon: 'tShirtBold', iconColor: 'secondary' });
  } else {
    items.push({ label: 'Stay cool', icon: 'tShirtBold', iconColor: 'secondary' });
  }

  // Rain
  if (current.rainProbability > 70) {
    items.push({ label: 'Take umbrella', icon: 'umbrellaBold', iconColor: 'accent' });
  } else if (current.rainProbability >= 40) {
    items.push({ label: 'Umbrella optional', icon: 'umbrellaBold', iconColor: 'mutedText' });
  }

  // UV
  if (items.length < 3 && current.uvIndex >= 6) {
    items.push({ label: 'Sunscreen needed', icon: 'sunBold', iconColor: 'secondary' });
  }

  // Wind
  if (items.length < 3 && current.windSpeed > 25) {
    items.push({ label: 'Windproof layer', icon: 'windBold', iconColor: 'primary' });
  }

  // Comfortable shoes (always last, cap at 4)
  if (items.length < 4) {
    items.push({ label: 'Comfortable shoes', icon: 'walkingBold', iconColor: 'accent' });
  }

  return items.slice(0, 4);
}

// ---------------------------------------------------------------------------
// Should I cards
// ---------------------------------------------------------------------------

export function getShouldICards(
  current: CurrentConditions,
  score: number
): ShouldICardData[] {
  // Umbrella
  let umbrellaAnswer: string;
  let umbrellaColor: ThemeColorToken | undefined;
  if (current.rainProbability > 70) {
    umbrellaAnswer = 'Yes, take it';
    umbrellaColor = 'danger';
  } else if (current.rainProbability >= 40) {
    umbrellaAnswer = 'Maybe after 3 PM';
    umbrellaColor = 'accent';
  } else {
    umbrellaAnswer = 'No need today';
    umbrellaColor = 'primary';
  }

  // Walk
  let walkAnswer: string;
  let walkColor: ThemeColorToken | undefined;
  if (score >= 70 && current.windSpeed < 20) {
    walkAnswer = 'Great time!';
    walkColor = 'primary';
  } else if (score >= 50) {
    walkAnswer = 'Manageable';
    walkColor = 'secondary';
  } else {
    walkAnswer = 'Skip today';
    walkColor = 'danger';
  }

  // Laundry
  let laundryAnswer: string;
  let laundryColor: ThemeColorToken | undefined;
  if (current.rainProbability < 20 && current.windSpeed < 25) {
    laundryAnswer = 'Safe to dry';
    laundryColor = 'primary';
  } else if (current.rainProbability < 50) {
    laundryAnswer = 'Risky';
    laundryColor = 'accent';
  } else {
    laundryAnswer = 'Inside only';
    laundryColor = 'danger';
  }

  return [
    { question: 'Umbrella?', answer: umbrellaAnswer, answerColor: umbrellaColor },
    { question: 'Walk?', answer: walkAnswer, answerColor: walkColor },
    { question: 'Dry clothes?', answer: laundryAnswer, answerColor: laundryColor },
  ];
}

// ---------------------------------------------------------------------------
// Day name helpers
// ---------------------------------------------------------------------------

function safeDateFromIso(isoDate: string): Date {
  // Append noon to avoid UTC-midnight day shift on JS Date parse
  return new Date(`${isoDate}T12:00:00`);
}

function formatDayName(isoDate: string): string {
  return safeDateFromIso(isoDate).toLocaleDateString('en-GB', { weekday: 'long' });
}

function formatShortDate(isoDate: string): string {
  return safeDateFromIso(isoDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  }); // "6 Jun"
}

// ---------------------------------------------------------------------------
// Forecast builders
// ---------------------------------------------------------------------------

export function buildForecastDays(daily: DailySlice[]): ForecastDay[] {
  return daily.map((slice, i) => {
    const mapping = getWeatherCodeMapping(slice.weatherCode);
    return {
      id: `day-${i}`,
      dayName: i === 0 ? 'Tomorrow' : formatDayName(slice.isoDate),
      date: formatShortDate(slice.isoDate),
      icon: mapping.iconKey,
      iconColor: mapping.iconColor,
      condition: mapping.conditionLabel,
      highTemp: slice.highTemp,
      lowTemp: slice.lowTemp,
      rainChance: slice.rainChance,
      label: mapping.simpleToneLabel,
      labelColor: mapping.labelColor,
      selected: false,
    };
  });
}

export function buildOutlookDays(outlook: DailySlice[]): OutlookDay[] {
  return outlook.map((slice, i) => {
    const mapping = getWeatherCodeMapping(slice.weatherCode);
    return {
      id: `outlook-${i}`,
      dayName: formatDayName(slice.isoDate),
      date: formatShortDate(slice.isoDate),
      icon: mapping.iconKey,
      iconColor: mapping.iconColor,
      highTemp: slice.highTemp,
      lowTemp: slice.lowTemp,
    };
  });
}

export function buildHourlyForecast(hourly: HourlySlice[]): HourlyForecast[] {
  return hourly.map(slice => {
    const mapping = getWeatherCodeMapping(slice.weatherCode);
    return {
      time: slice.hour,
      icon: mapping.iconKey,
      iconColor: mapping.iconColor,
      temperature: slice.temperature,
      rainChance: slice.rainChance,
    };
  });
}

// ---------------------------------------------------------------------------
// Quest helpers
// ---------------------------------------------------------------------------

function deriveQuest(current: CurrentConditions): string {
  if (current.rainProbability > 60) return 'Find a cosy spot and enjoy the rain sounds';
  if (current.temperature > 25) return 'Get outside for your golden hour walk';
  if (current.windSpeed > 30) return 'Take a breath of fresh air by an open window';
  return 'Take a 10-minute fresh air break';
}

function deriveBestTime(hourly: HourlySlice[]): string {
  // Find the slot with the lowest rain chance and reasonable temperature
  let bestIndex = 0;
  let bestScore = Infinity;
  hourly.forEach((slice, i) => {
    const score = slice.rainChance + Math.abs(slice.temperature - 20);
    if (score < bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  });
  const best = hourly[bestIndex];
  if (!best || best.hour === 'Now') return 'Later today';
  // Return a 2-hour window
  const startHour = best.hour;
  return `Around ${startHour}`;
}

function formatUvIndex(uv: number): string {
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Moderate';
  if (uv <= 7) return 'High';
  return 'Very High';
}

function buildReadinessSummary(current: CurrentConditions, score: number): string {
  const parts: string[] = [];
  if (current.temperature < 10) parts.push('Bundle up — it\'s cold out there.');
  else if (current.temperature > 28) parts.push('It\'s warm — dress light and stay cool.');
  if (current.rainProbability > 50) parts.push('Rain is likely; pack your umbrella.');
  if (current.windSpeed > 25) parts.push('Strong winds expected; layer up.');
  if (current.uvIndex >= 6) parts.push('UV is high; sunscreen recommended.');
  if (score >= 80) parts.push('Conditions are great — get outside!');
  if (parts.length === 0) parts.push('Looks comfortable out there. Enjoy your day!');
  return parts.join(' ');
}

// ---------------------------------------------------------------------------
// Master builder — produces currentWeather-shaped object from WeatherPayload
// ---------------------------------------------------------------------------

export function buildCurrentWeatherDisplay(payload: WeatherPayload) {
  const { current, city, daily, hourly } = payload;
  const score = getComfortScore(current);
  const mapping = getWeatherCodeMapping(current.weatherCode);
  const today = new Date();

  return {
    location: city.name,
    greeting: getGreeting(),
    temperature: current.temperature,
    condition: mapping.conditionLabel,
    icon: mapping.iconKey as IconKey,
    iconColor: mapping.iconColor as ThemeColorToken,
    weatherMood: getWeatherMood(current.weatherCode, current.isDay, current.temperature),
    comfortScore: score,
    comfortDescription: getComfortDescription(score, current),
    essentials: getEssentials(current),
    shouldICards: getShouldICards(current, score),
    quest: {
      title: "Today's Weather Quest",
      quest: deriveQuest(current),
      bestTime: deriveBestTime(hourly),
      reward: 'Weather Watcher Badge',
    },
    detail: {
      dayTitle: today.toLocaleDateString('en-GB', { weekday: 'long' }),
      date: `${city.name.toUpperCase()} · ${today.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toUpperCase()}`,
      highTemp: daily[0]?.highTemp ?? current.temperature,
      lowTemp: daily[0]?.lowTemp ?? current.temperature,
      feelsLike: `${current.feelsLike}°`,
      rainProbability: `${current.rainProbability}%`,
      windSpeed: `${current.windSpeed} mph`,
      humidity: `${current.humidity}%`,
      uvIndex: formatUvIndex(current.uvIndex),
      readinessSummary: buildReadinessSummary(current, score),
    },
  };
}

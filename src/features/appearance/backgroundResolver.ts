import type { AppTheme } from '@/theme/themeTypes';
import type { BackgroundMode } from '@/theme/themeTypes';
import type { BackgroundResult } from './appearanceTypes';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export function getTimeOfDay(date: Date): TimeOfDay {
  const h = date.getHours();
  if (h >= 5  && h <= 11) return 'morning';
  if (h >= 12 && h <= 16) return 'afternoon';
  if (h >= 17 && h <= 20) return 'evening';
  return 'night';
}

// For dark themes (night-cloud, race-day) use their own screen gradient
function isDarkTheme(theme: AppTheme): boolean {
  return theme.id === 'night-cloud' || theme.id === 'race-day';
}

export function getWeatherBackground(conditionCode: number, theme: AppTheme): BackgroundResult {
  if (isDarkTheme(theme)) {
    return { type: 'gradient', colors: theme.gradients.screen as [string, string, ...string[]] };
  }

  if (conditionCode === 0) {
    return { type: 'gradient', colors: ['#FEF3C7', '#FFFDF5'] };
  }
  if (conditionCode >= 1 && conditionCode <= 3) {
    return { type: 'gradient', colors: ['#E0F2FE', '#FFFDF5'] };
  }
  if (conditionCode >= 45 && conditionCode <= 48) {
    return { type: 'gradient', colors: ['#E5E7EB', '#FFFDF5'] };
  }
  if (conditionCode >= 51 && conditionCode <= 67) {
    return { type: 'gradient', colors: ['#DBEAFE', '#EDE9FE'] };
  }
  if (conditionCode >= 71 && conditionCode <= 77) {
    return { type: 'gradient', colors: ['#EFF6FF', '#F8FAFC'] };
  }
  if (conditionCode >= 80 && conditionCode <= 82) {
    return { type: 'gradient', colors: ['#BFDBFE', '#C7D2FE'] };
  }
  if (conditionCode >= 85 && conditionCode <= 86) {
    return { type: 'gradient', colors: ['#F0F9FF', '#EFF6FF'] };
  }
  if (conditionCode >= 95 && conditionCode <= 99) {
    return { type: 'gradient', colors: ['#312E81', '#1E1B4B'] };
  }
  return { type: 'color', color: theme.colors.background };
}

export function getTimeBackground(date: Date, theme: AppTheme): BackgroundResult {
  if (isDarkTheme(theme)) {
    return { type: 'gradient', colors: theme.gradients.screen as [string, string, ...string[]] };
  }

  const tod = getTimeOfDay(date);
  switch (tod) {
    case 'morning':   return { type: 'gradient', colors: ['#FFF8E7', '#FFFDE7'] };
    case 'afternoon': return { type: 'gradient', colors: ['#E0F2FE', '#F0FDFA'] };
    case 'evening':   return { type: 'gradient', colors: ['#FDE68A', '#FECDD3'] };
    case 'night':     return { type: 'gradient', colors: ['#1E1B4B', '#0F172A'] };
  }
}

export function resolveAppBackground(opts: {
  theme: AppTheme;
  backgroundMode: BackgroundMode;
  currentWeatherCode?: number;
  customBackgroundUri?: string | null;
}): BackgroundResult {
  const { theme, backgroundMode, currentWeatherCode, customBackgroundUri } = opts;

  switch (backgroundMode) {
    case 'weather':
      if (currentWeatherCode !== undefined && currentWeatherCode !== null) {
        return getWeatherBackground(currentWeatherCode, theme);
      }
      return { type: 'color', color: theme.colors.background };

    case 'time':
      return getTimeBackground(new Date(), theme);

    case 'custom':
      if (customBackgroundUri) {
        return { type: 'image', uri: customBackgroundUri };
      }
      return { type: 'color', color: theme.colors.background };

    case 'theme':
    default:
      return { type: 'color', color: theme.colors.background };
  }
}

import type { IconKey } from '../assets/icons';
import type { ThemeColorToken } from '@/theme';

export type HourlyForecast = {
  time: string;
  icon: IconKey;
  iconColor: ThemeColorToken;
  temperature: number;
  rainChance: number;
};

export type ShouldICardData = {
  question: string;
  answer: string;
  answerColor?: ThemeColorToken;
};

export type EssentialData = {
  label: string;
  icon: IconKey;
  iconColor: ThemeColorToken;
};

export type ForecastDay = {
  id: string;
  dayName: string;
  date: string;
  icon: IconKey;
  iconColor: ThemeColorToken;
  condition: string;
  highTemp: number;
  lowTemp: number;
  rainChance: number;
  label: string;
  labelColor: 'primary' | 'accent' | 'secondary' | 'muted';
  selected?: boolean;
};

export type OutlookDay = {
  id: string;
  dayName: string;
  date: string;
  icon: IconKey;
  iconColor: ThemeColorToken;
  highTemp: number;
  lowTemp: number;
};

export const currentWeather = {
  location: 'Newcastle',
  greeting: 'Good morning',
  temperature: 12,
  condition: 'Cloudy',
  icon: 'cloudsBold' as IconKey,
  iconColor: 'primary',
  weatherMood: 'Soft cloudy morning',
  comfortScore: 78,
  comfortDescription: 'Nice overall, but slightly windy later.',
  essentials: [
    { label: 'Light layer', icon: 'tShirtBold' as IconKey, iconColor: 'primary' },
    { label: 'Umbrella optional', icon: 'umbrellaBold' as IconKey, iconColor: 'mutedText' },
    { label: 'Comfy shoes', icon: 'walkingBold' as IconKey, iconColor: 'accent' },
  ] satisfies EssentialData[],
  shouldICards: [
    { question: 'Umbrella?', answer: 'Maybe after 3 PM' },
    { question: 'Walk?', answer: 'Best before 6 PM', answerColor: 'primary' },
    { question: 'Dry clothes?', answer: 'Risky', answerColor: 'danger' },
  ] satisfies ShouldICardData[],
  quest: {
    title: "Today's Weather Quest",
    quest: 'Take a 10-minute fresh air break',
    bestTime: '4 PM – 6 PM',
    reward: 'Sunny Badge',
  },
  detail: {
    dayTitle: 'Friday',
    date: 'NEWCASTLE · MAY 28',
    highTemp: 18,
    lowTemp: 14,
    feelsLike: '14°',
    rainProbability: '85%',
    windSpeed: '18 mph',
    humidity: '72%',
    uvIndex: 'Low',
    readinessSummary:
      'Layer up in the morning. Rain risk is low, but it gets breezy later. A wind-resistant jacket is recommended for your walk!',
  },
};

export const hourlyForecast: HourlyForecast[] = [
  { time: 'Now', icon: 'cloudsBold', iconColor: 'primary', temperature: 12, rainChance: 20 },
  { time: '11 AM', icon: 'cloudsBold', iconColor: 'primary', temperature: 13, rainChance: 25 },
  { time: '12 PM', icon: 'cloudSunBold', iconColor: 'secondary', temperature: 14, rainChance: 35 },
  { time: '01 PM', icon: 'sunBold', iconColor: 'secondary', temperature: 16, rainChance: 10 },
  { time: '02 PM', icon: 'sunBold', iconColor: 'secondary', temperature: 17, rainChance: 5 },
];

export const sevenDayForecast: ForecastDay[] = [
  {
    id: 'day-1',
    dayName: 'Tomorrow',
    date: 'May 25',
    icon: 'sunBold',
    iconColor: 'secondary',
    condition: 'Sunny',
    highTemp: 24,
    lowTemp: 18,
    rainChance: 0,
    label: 'Sunny little win',
    labelColor: 'primary',
  },
  {
    id: 'day-2',
    dayName: 'Wednesday',
    date: 'May 26',
    icon: 'cloudsBold',
    iconColor: 'primary',
    condition: 'Cloudy',
    highTemp: 21,
    lowTemp: 17,
    rainChance: 10,
    label: 'Cloudy reset day',
    labelColor: 'muted',
  },
  {
    id: 'day-3',
    dayName: 'Thursday',
    date: 'May 27',
    icon: 'cloudRainBold',
    iconColor: 'accent',
    condition: 'Rainy evening',
    highTemp: 18,
    lowTemp: 14,
    rainChance: 85,
    label: 'Rainy evening',
    labelColor: 'accent',
    selected: true,
  },
  {
    id: 'day-4',
    dayName: 'Friday',
    date: 'May 28',
    icon: 'windBold',
    iconColor: 'secondary',
    condition: 'Windy',
    highTemp: 20,
    lowTemp: 15,
    rainChance: 5,
    label: 'Windy boss battle',
    labelColor: 'secondary',
  },
  {
    id: 'day-5',
    dayName: 'Saturday',
    date: 'May 29',
    icon: 'cloudSunBold',
    iconColor: 'primary',
    condition: 'Partly cloudy',
    highTemp: 22,
    lowTemp: 17,
    rainChance: 5,
    label: 'Soft sky day',
    labelColor: 'primary',
  },
];

export const sixteenDayOutlook: OutlookDay[] = [
  { id: 'day-6', dayName: 'Sunday 30', date: '30 May', icon: 'sunBold', iconColor: 'secondary', highTemp: 25, lowTemp: 18 },
  { id: 'day-7', dayName: 'Monday 31', date: '31 May', icon: 'cloudsBold', iconColor: 'primary', highTemp: 22, lowTemp: 16 },
  { id: 'day-8', dayName: 'Tuesday 01', date: '1 Jun', icon: 'cloudRainBold', iconColor: 'accent', highTemp: 19, lowTemp: 15 },
];

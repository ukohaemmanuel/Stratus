import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon, type IconName } from '@/components/ui/AppIcon';
import {
  buildForecastDays,
  buildHourlyForecast,
  getWeatherCodeMapping,
} from '@/features/weather/weatherInterpreter';
import { useWeatherStore } from '@/features/weather/weatherStore';
import { usePreferencesStore } from '@/features/preferences/preferencesStore';
import { alpha, themeColor } from '@/theme/colorUtils';
import { sleekTokens, type ThemeColorToken, useAppTheme } from '@/theme';
import { formatTemperature } from '@/utils/temperature';

const mascotRainy = require('../assets/images/mascots/mascot-rainy.png');
const mascotSunny = require('../assets/images/mascots/mascot-sunny.png');

// Static fallback hourly timeline used when store has no payload
const fallbackHourly: Array<{
  time: string;
  icon: IconName;
  iconColor: ThemeColorToken;
  temp: number;
  progress: number;
}> = [
  { time: '09 AM', icon: 'solar-cloud-sun-bold', iconColor: 'secondary', temp: 16, progress: 0.4 },
  { time: '12 PM', icon: 'solar-clouds-bold', iconColor: 'primary', temp: 18, progress: 0.7 },
  { time: '03 PM', icon: 'solar-cloud-rain-bold', iconColor: 'accent', temp: 17, progress: 0.9 },
  { time: '06 PM', icon: 'solar-wind-bold', iconColor: 'secondary', temp: 15, progress: 0.6 },
];

export default function WeatherDetailScreen() {
  const theme = useAppTheme();
  const r = sleekTokens.radii;
  const t = theme.colors;
  const params = useLocalSearchParams<{ city?: string; day?: string }>();

  const payload          = useWeatherStore(s => s.currentPayload);
  const selectedDayIndex = useWeatherStore(s => s.selectedDayIndex);
  const unit             = usePreferencesStore(s => s.temperatureUnit);

  const isToday  = selectedDayIndex === null;
  const daySlice = !isToday && payload ? payload.daily[selectedDayIndex] : null;

  // City and day label
  const city    = payload?.city.name ?? params.city ?? 'Newcastle';
  const dayLabel = isToday
    ? new Date().toLocaleDateString('en-GB', { weekday: 'long' })
    : (payload
        ? buildForecastDays(payload.daily)[selectedDayIndex!]?.dayName ?? (params.day ?? 'Friday')
        : (params.day ?? 'Friday'));

  // Temperature
  const highTemp = isToday
    ? (payload?.daily[0]?.highTemp ?? 18)
    : (daySlice?.highTemp ?? 18);
  const lowTemp  = isToday
    ? (payload?.daily[0]?.lowTemp ?? 14)
    : (daySlice?.lowTemp ?? 14);

  // Condition label + mood
  const weatherCode = isToday
    ? (payload?.current.weatherCode ?? 3)
    : (daySlice?.weatherCode ?? 3);
  const mapping    = getWeatherCodeMapping(weatherCode);
  const moodLabel  = mapping.weatherMood;
  const moodColor  = themeColor(theme, mapping.iconColor);

  // Metrics
  const rain     = isToday ? `${payload?.current.rainProbability ?? 85}%` : `${daySlice?.rainChance ?? 0}%`;
  const wind     = isToday ? `${payload?.current.windSpeed ?? 18} mph`    : `${daySlice?.windSpeedMax ?? 0} mph`;
  const feelsLike = formatTemperature(payload?.current.feelsLike ?? 14, unit);
  const rawUv    = isToday ? (payload?.current.uvIndex ?? 0) : (daySlice?.uvIndexMax ?? 0);
  const uvLabel  = rawUv <= 2 ? 'Low' : rawUv <= 5 ? 'Moderate' : rawUv <= 7 ? 'High' : 'Very High';
  const summary  = payload?.city
    ? (isToday
        ? `${city.toUpperCase()} · ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toUpperCase()}`
        : `${city.toUpperCase()}`)
    : `${city.toUpperCase()} · MAY 28`;

  // Hourly timeline
  const hourlyItems = payload
    ? buildHourlyForecast(payload.hourly).map(h => ({
        time: h.time,
        icon: h.icon as IconName,
        iconColor: h.iconColor,
        temp: h.temperature,
        progress: Math.min(1, h.rainChance / 100),
      }))
    : fallbackHourly;

  // Pick mascot based on condition
  const mascot = weatherCode >= 60 ? mascotRainy : mascotSunny;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.background }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
        {/* Header */}
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            gap: 16,
            paddingBottom: 24,
            paddingHorizontal: 24,
            paddingTop: 12,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => router.back()}
            style={{
              alignItems: 'center',
              backgroundColor: t.card,
              borderColor: t.border,
              borderRadius: r.full,
              borderWidth: 1,
              height: 48,
              justifyContent: 'center',
              shadowColor: t.primary,
              shadowOpacity: 0.06,
              shadowRadius: 8,
              width: 48,
            }}
          >
            <AppIcon name="solar-alt-arrow-left-bold" size={24} color={t.text} />
          </TouchableOpacity>
          <View>
            <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 24, lineHeight: 28 }}>
              {dayLabel}
            </Text>
            <Text
              style={{
                color: t.mutedText,
                fontFamily: 'Quicksand_700Bold',
                fontSize: 12,
                letterSpacing: 1.5,
                marginTop: 2,
                textTransform: 'uppercase',
              }}
            >
              {summary}
            </Text>
          </View>
        </View>

        {/* Hero card */}
        <View style={{ paddingHorizontal: 24 }}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: t.card,
              borderColor: t.border,
              borderRadius: r.rounded3rem,
              borderWidth: 1,
              marginBottom: 16,
              overflow: 'hidden',
              padding: 40,
              position: 'relative',
              shadowColor: t.primary,
              shadowOpacity: 0.06,
              shadowRadius: 8,
            }}
          >
            <View style={{ opacity: 0.03, position: 'absolute', right: 0, top: 0, transform: [{ rotate: '12deg' }] }}>
              <AppIcon name={mapping.iconKey} size={180} color={t.text} />
            </View>
            <Image source={mascot} style={{ height: 192, marginBottom: 16, width: 192, zIndex: 1 }} contentFit="contain" />
            <View style={{ alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'center', zIndex: 1 }}>
              <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 96, lineHeight: 100 }}>
                {formatTemperature(highTemp, unit)}
              </Text>
              <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 30, marginTop: 24 }}>
                /{formatTemperature(lowTemp, unit)}
              </Text>
            </View>
            <Text style={{ color: moodColor, fontFamily: 'Quicksand_700Bold', fontSize: 24, marginTop: 8, zIndex: 1 }}>
              {moodLabel}
            </Text>
          </View>
        </View>

        {/* Metric grid */}
        <View style={{ gap: 16, paddingHorizontal: 24 }}>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <MetricCard icon="solar-waterdrop-bold" iconColor={t.primary} label="Rain chance" value={rain} />
            <MetricCard icon="solar-wind-bold" iconColor={t.secondary} label="Wind Speed" value={wind} />
          </View>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <MetricCard icon="solar-thermometer-bold" iconColor={t.accent} label="Feels Like" value={feelsLike} />
            <MetricCard icon="solar-sun-fog-bold" iconColor={t.secondary} label="UV Index" value={uvLabel} />
          </View>
        </View>

        {/* Readiness summary */}
        <View
          style={{
            backgroundColor: alpha(t.primary, 0.05),
            borderColor: alpha(t.primary, 0.10),
            borderRadius: r.rounded2_5rem,
            borderWidth: 1,
            marginHorizontal: 24,
            marginTop: 16,
            overflow: 'hidden',
            padding: 32,
          }}
        >
          <View style={{ bottom: -24, opacity: 0.08, position: 'absolute', right: -24 }}>
            <AppIcon name="solar-shield-user-bold" size={120} color={t.primary} />
          </View>
          <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 20, marginBottom: 12 }}>
            Weather-ready summary
          </Text>
          <Text style={{ color: alpha(t.primary, 0.70), fontFamily: 'Quicksand_700Bold', fontSize: 16, lineHeight: 24 }}>
            {payload?.city
              ? (isToday
                  ? `${mapping.conditionLabel} conditions. ${wind} winds. Feels like ${feelsLike}.`
                  : `${mapping.conditionLabel} day. High ${formatTemperature(highTemp, unit)}, low ${formatTemperature(lowTemp, unit)}. ${rain} chance of rain.`)
              : 'Layer up in the morning. Rain risk is low, but it gets breezy later.'}
          </Text>
        </View>

        {/* Hourly timeline */}
        <View style={{ marginTop: 16, paddingHorizontal: 24 }}>
          <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 20, marginBottom: 16, paddingHorizontal: 8 }}>
            Hourly Timeline
          </Text>
          <View
            style={{
              backgroundColor: t.card,
              borderColor: t.border,
              borderRadius: r.rounded3rem,
              borderWidth: 1,
              gap: 24,
              padding: 32,
              shadowColor: t.primary,
              shadowOpacity: 0.06,
              shadowRadius: 8,
            }}
          >
            {hourlyItems.map((item) => {
              const color = themeColor(theme, item.iconColor);
              return (
                <View key={item.time} style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 12, width: 54 }}>
                    {item.time}
                  </Text>
                  <AppIcon name={item.icon} size={28} color={color} />
                  <View
                    style={{
                      backgroundColor: t.background,
                      borderColor: alpha(t.border, 0.5),
                      borderRadius: r.full,
                      borderWidth: 1,
                      flex: 1,
                      height: 8,
                      marginHorizontal: 24,
                      overflow: 'hidden',
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: color,
                        borderRadius: r.full,
                        height: '100%',
                        opacity: 0.8,
                        width: `${item.progress * 100}%`,
                      }}
                    />
                  </View>
                  <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 16 }}>
                    {formatTemperature(item.temp, unit)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MetricCard({
  icon,
  iconColor,
  label,
  value,
}: {
  icon: IconName;
  iconColor: string;
  label: string;
  value: string;
}) {
  const theme = useAppTheme();
  const r = sleekTokens.radii;
  const t = theme.colors;

  return (
    <View
      style={{
        backgroundColor: t.card,
        borderColor: t.border,
        borderRadius: r.rounded2_5rem,
        borderWidth: 1,
        flex: 1,
        gap: 12,
        padding: 24,
        shadowColor: t.primary,
        shadowOpacity: 0.06,
        shadowRadius: 8,
      }}
    >
      <Text
        style={{
          color: t.mutedText,
          fontFamily: 'Quicksand_700Bold',
          fontSize: 10,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
      <View style={{ alignItems: 'center', flexDirection: 'row', gap: 12 }}>
        <AppIcon name={icon} size={24} color={iconColor} />
        <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 24 }}>
          {value}
        </Text>
      </View>
    </View>
  );
}

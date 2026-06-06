import { router } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/ui/AppIcon';
import { sevenDayForecast, sixteenDayOutlook } from '@/data/mockWeather';
import {
  buildForecastDays,
  buildOutlookDays,
} from '@/features/weather/weatherInterpreter';
import { useWeatherStore } from '@/features/weather/weatherStore';
import { alpha, themeColor } from '@/theme/colorUtils';
import { sleekTokens, useAppTheme } from '@/theme';

export default function ForecastScreen() {
  const theme = useAppTheme();
  const r = sleekTokens.radii;
  const t = theme.colors;
  const labelColors = {
    primary:   { bg: alpha(t.primary, 0.10), text: t.primary },
    accent:    { bg: alpha(t.accent, 0.10), text: t.accent },
    secondary: { bg: alpha(t.secondary, 0.20), text: t.secondaryForeground },
    muted:     { bg: t.muted, text: t.mutedText },
  };

  const payload      = useWeatherStore(s => s.currentPayload);
  const setSelectedDay = useWeatherStore(s => s.setSelectedDay);

  const forecast = payload ? buildForecastDays(payload.daily) : sevenDayForecast;
  const outlook  = payload ? buildOutlookDays(payload.outlook) : sixteenDayOutlook;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.background }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 128 }}>
        <View style={{ paddingBottom: 24, paddingHorizontal: 24, paddingTop: 12 }}>
          <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 30 }}>
            7-Day Forecast
          </Text>
          <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 16, marginTop: 2 }}>
            A simple look at the week ahead
          </Text>
        </View>

        <View style={{ gap: 16, paddingHorizontal: 24 }}>
          {forecast.map((day, index) => {
            const label = labelColors[day.labelColor];

            return (
              <TouchableOpacity
                key={day.id}
                activeOpacity={0.82}
                onPress={() => {
                  setSelectedDay(index);
                  router.push('/weather-detail');
                }}
              >
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: t.card,
                    borderColor: day.selected ? alpha(t.accent, 0.20) : t.border,
                    borderRadius: r.rounded2_5rem,
                    borderWidth: day.selected ? 2 : 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 24,
                    shadowColor: t.primary,
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ alignItems: 'center', flexDirection: 'row', gap: 8 }}>
                      <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 18 }}>
                        {day.dayName}
                      </Text>
                      <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 12 }}>
                        {day.date}
                      </Text>
                    </View>
                    <View
                      style={{
                        alignSelf: 'flex-start',
                        backgroundColor: label.bg,
                        borderRadius: r.full,
                        marginTop: 4,
                        paddingHorizontal: 12,
                        paddingVertical: 4,
                      }}
                    >
                      <Text style={{ color: label.text, fontFamily: 'Quicksand_700Bold', fontSize: 10 }}>
                        {day.label}
                      </Text>
                    </View>
                  </View>

                  <View style={{ alignItems: 'center', flexDirection: 'row', gap: 24 }}>
                    <View style={{ alignItems: 'center' }}>
                      <AppIcon name={day.icon} size={36} color={themeColor(theme, day.iconColor)} />
                      <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 10, marginTop: 2 }}>
                        {day.rainChance}% rain
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 24 }}>
                        {day.highTemp}°
                      </Text>
                      <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 14 }}>
                        {day.lowTemp}°
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ marginTop: 32 }}>
          <Text
            style={{
              color: t.text,
              fontFamily: 'Quicksand_700Bold',
              fontSize: 18,
              marginBottom: 16,
              paddingHorizontal: 24,
            }}
          >
            16-Day Outlook
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingHorizontal: 24 }}
          >
            {outlook.map((day) => (
              <View
                key={day.id}
                style={{
                  backgroundColor: t.card,
                  borderColor: t.border,
                  borderRadius: r.rounded2rem,
                  borderWidth: 1,
                  gap: 8,
                  minWidth: 120,
                  padding: 20,
                  shadowColor: t.primary,
                  shadowOpacity: 0.06,
                  shadowRadius: 8,
                }}
              >
                <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 12 }}>
                  {day.dayName}
                </Text>
                <AppIcon name={day.icon} size={24} color={themeColor(theme, day.iconColor)} />
                <View style={{ alignItems: 'center', flexDirection: 'row', gap: 8 }}>
                  <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 18 }}>
                    {day.highTemp}°
                  </Text>
                  <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 12 }}>
                    {day.lowTemp}°
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <Text
            style={{
              color: t.mutedText,
              fontFamily: 'Quicksand_700Bold',
              fontSize: 10,
              letterSpacing: 1,
              lineHeight: 16,
              marginTop: 8,
              paddingHorizontal: 24,
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            Longer range forecasts can change, but they're useful for planning.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

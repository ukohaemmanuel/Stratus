import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/ui/AppIcon';
import { currentWeather, hourlyForecast } from '@/data/mockWeather';
import {
  buildCurrentWeatherDisplay,
  buildHourlyForecast,
} from '@/features/weather/weatherInterpreter';
import { useWeatherStore } from '@/features/weather/weatherStore';
import { usePreferencesStore } from '@/features/preferences/preferencesStore';
import { STALE_MESSAGE, isWeatherCacheStale } from '@/features/weather/weatherCache';
import { alpha, themeColor } from '@/theme/colorUtils';
import { sleekTokens, useAppTheme } from '@/theme';
import { formatTemperature } from '@/utils/temperature';
import { useEffect, useState } from 'react';

const mascotSunny = require('../../assets/images/mascots/mascot-sunny.png');
const mascotQuest = require('../../assets/images/mascots/mascot-quest.png');

export default function TodayScreen() {
  const theme = useAppTheme();
  const r = sleekTokens.radii;
  const t = theme.colors;

  const payload             = useWeatherStore(s => s.currentPayload);
  const isLoading           = useWeatherStore(s => s.isLoadingCurrent);
  const error               = useWeatherStore(s => s.error);
  const selectedLocation    = useWeatherStore(s => s.selectedLocation);
  const fetchWeatherForCity = useWeatherStore(s => s.fetchWeatherForCity);
  const fetchWeatherForCurrentLocation = useWeatherStore(s => s.fetchWeatherForCurrentLocation);
  const clearError          = useWeatherStore(s => s.clearError);

  const unit = usePreferencesStore(s => s.temperatureUnit);

  const [isStale, setIsStale] = useState(false);

  // Check if cache is stale
  useEffect(() => {
    if (!selectedLocation) return;
    isWeatherCacheStale(selectedLocation.id).then(setIsStale);
  }, [selectedLocation, payload]);

  const handleRefresh = () => {
    if (selectedLocation) {
      fetchWeatherForCity(selectedLocation);
    } else {
      fetchWeatherForCurrentLocation();
    }
  };

  // Derived display data — falls back to mock if no payload yet
  const weather = payload ? buildCurrentWeatherDisplay(payload) : currentWeather;
  const hourly  = payload ? buildHourlyForecast(payload.hourly) : hourlyForecast;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.background }} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 128 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && !!payload}
            onRefresh={handleRefresh}
            tintColor={t.primary}
            colors={[t.primary]}
          />
        }
      >

        {/* Header */}
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: 16,
            paddingHorizontal: 24,
            paddingTop: 12,
          }}
        >
          <View>
            <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 14 }}>
              {weather.greeting}
            </Text>
            <View
              style={{
                alignItems: 'center',
                alignSelf: 'flex-start',
                backgroundColor: t.card,
                borderColor: t.border,
                borderRadius: r.full,
                borderWidth: 1,
                flexDirection: 'row',
                gap: 8,
                marginTop: 4,
                paddingHorizontal: 16,
                paddingVertical: 6,
                shadowColor: t.primary,
                shadowOpacity: 0.06,
                shadowRadius: 8,
              }}
            >
              <AppIcon name="solar-map-point-bold" size={16} color={t.primary} />
              <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 14 }}>
                {weather.location}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.75}
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
            <AppIcon name="solar-bell-bing-bold-duotone" size={24} color={t.primary} />
          </TouchableOpacity>
        </View>

        {/* Error banner */}
        {error && (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={clearError}
            style={{
              backgroundColor: alpha(t.danger, 0.10),
              borderRadius: r.rounded2rem,
              marginBottom: 8,
              marginHorizontal: 24,
              padding: 12,
            }}
          >
            <Text style={{ color: t.danger, fontFamily: 'Quicksand_700Bold', fontSize: 12, textAlign: 'center' }}>
              Couldn't refresh weather. Showing saved data. Tap to dismiss.
            </Text>
          </TouchableOpacity>
        )}

        {/* Stale cache banner */}
        {!error && isStale && payload && (
          <View
            style={{
              backgroundColor: alpha(t.secondary, 0.10),
              borderRadius: r.rounded2rem,
              marginBottom: 8,
              marginHorizontal: 24,
              padding: 10,
            }}
          >
            <Text style={{ color: t.secondary, fontFamily: 'Quicksand_700Bold', fontSize: 11, textAlign: 'center' }}>
              {STALE_MESSAGE}
            </Text>
          </View>
        )}

        {/* Hero: mascot + temperature */}
        {isLoading && !payload ? (
          <View style={{ alignItems: 'center', paddingVertical: 48 }}>
            <ActivityIndicator size="large" color={t.primary} />
            <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 14, marginTop: 12 }}>
              Looking at the sky…
            </Text>
          </View>
        ) : (
          <View style={{ alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16 }}>
            <Image source={mascotSunny} style={{ height: 192, marginBottom: 8, width: 192 }} contentFit="contain" />
            <View style={{ alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 96, lineHeight: 100 }}>
                {unit === 'fahrenheit'
                  ? formatTemperature(typeof weather.temperature === 'number' ? weather.temperature : parseInt(String(weather.temperature), 10), unit).replace('°', '')
                  : weather.temperature}
              </Text>
              <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 36, marginTop: 16 }}>
                °
              </Text>
            </View>
            <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 24, marginTop: -12 }}>
              {weather.condition}
            </Text>
            <View
              style={{
                backgroundColor: alpha(t.primary, 0.10),
                borderColor: alpha(t.primary, 0.20),
                borderRadius: r.full,
                borderWidth: 1,
                marginTop: 16,
                paddingHorizontal: 20,
                paddingVertical: 8,
              }}
            >
              <Text style={{ color: t.primary, fontFamily: 'Quicksand_700Bold', fontSize: 14 }}>
                {weather.weatherMood}
              </Text>
            </View>
          </View>
        )}

        {/* Comfort Score + Essentials */}
        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16, paddingHorizontal: 24 }}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: t.card,
              borderColor: t.border,
              borderRadius: r.rounded2_5rem,
              borderWidth: 1,
              flex: 1,
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
                marginBottom: 4,
                textAlign: 'center',
                textTransform: 'uppercase',
              }}
            >
              Comfort Score
            </Text>
            <Text style={{ color: t.primary, fontFamily: 'Quicksand_700Bold', fontSize: 48, lineHeight: 52 }}>
              {weather.comfortScore}
            </Text>
            <Text
              style={{
                color: t.mutedText,
                fontFamily: 'Quicksand_700Bold',
                fontSize: 11,
                lineHeight: 15,
                marginTop: 4,
                paddingHorizontal: 8,
                textAlign: 'center',
              }}
            >
              {weather.comfortDescription}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: t.card,
              borderColor: t.border,
              borderRadius: r.rounded2_5rem,
              borderWidth: 1,
              flex: 1,
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
                marginBottom: 12,
                textAlign: 'center',
                textTransform: 'uppercase',
              }}
            >
              Essentials
            </Text>
            <View style={{ gap: 10, paddingTop: 4 }}>
              {weather.essentials.map((item) => (
                <View key={item.label} style={{ alignItems: 'center', flexDirection: 'row', gap: 10 }}>
                  <AppIcon name={item.icon} size={18} color={themeColor(theme, item.iconColor)} />
                  <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 12 }}>
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Should I? */}
        <View
          style={{
            backgroundColor: t.card,
            borderColor: t.border,
            borderRadius: r.rounded2_5rem,
            borderWidth: 1,
            marginBottom: 16,
            marginHorizontal: 24,
            padding: 24,
            shadowColor: t.primary,
            shadowOpacity: 0.06,
            shadowRadius: 8,
          }}
        >
          <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 18, marginBottom: 16 }}>
            Should I?
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {weather.shouldICards.map((card) => (
              <View
                key={card.question}
                style={{
                  alignItems: 'center',
                  backgroundColor: t.background,
                  borderColor: alpha(t.border, 0.5),
                  borderRadius: r.rounded3xl,
                  borderWidth: 1,
                  flex: 1,
                  padding: 12,
                }}
              >
                <Text
                  style={{
                    color: t.mutedText,
                    fontFamily: 'Quicksand_700Bold',
                    fontSize: 9,
                    letterSpacing: 1,
                    textAlign: 'center',
                    textTransform: 'uppercase',
                  }}
                >
                  {card.question}
                </Text>
                <Text
                  style={{
                    color: card.answerColor ? themeColor(theme, card.answerColor) : t.text,
                    fontFamily: 'Quicksand_700Bold',
                    fontSize: 11,
                    lineHeight: 14,
                    marginTop: 4,
                    textAlign: 'center',
                  }}
                >
                  {card.answer}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Weather Quest */}
        <LinearGradient
          colors={[alpha(t.secondary, 0.10), alpha(t.primary, 0.10)]}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={{
            borderColor: t.card,
            borderRadius: r.rounded2_5rem,
            borderWidth: 1,
            marginBottom: 16,
            marginHorizontal: 24,
            padding: 24,
          }}
        >
          <View style={{ alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 18 }}>
                {weather.quest.title}
              </Text>
              <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 12, marginTop: 2 }}>
                {weather.quest.quest}
              </Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: t.card,
                borderRadius: r.rounded2xl,
                height: 48,
                justifyContent: 'center',
                shadowColor: t.primary,
                shadowOpacity: 0.06,
                shadowRadius: 8,
                width: 48,
              }}
            >
              <Image source={mascotQuest} style={{ height: 40, width: 40 }} contentFit="contain" />
            </View>
          </View>
          <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text
                style={{
                  color: t.mutedText,
                  fontFamily: 'Quicksand_700Bold',
                  fontSize: 10,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                }}
              >
                Best Time
              </Text>
              <Text style={{ color: t.primary, fontFamily: 'Quicksand_700Bold', fontSize: 14 }}>
                {weather.quest.bestTime}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.75}
              style={{
                backgroundColor: t.card,
                borderColor: alpha(t.border, 0.5),
                borderRadius: r.full,
                borderWidth: 1,
                paddingHorizontal: 24,
                paddingVertical: 10,
                shadowColor: t.primary,
                shadowOpacity: 0.06,
                shadowRadius: 8,
              }}
            >
              <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 14 }}>
                Mark done
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Hourly Forecast */}
        <View style={{ paddingHorizontal: 24 }}>
          <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 18, marginBottom: 16 }}>
            Hourly Forecast
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, paddingBottom: 8, paddingHorizontal: 24 }}
        >
          {hourly.map((hour) => (
            <View
              key={hour.time}
              style={{
                alignItems: 'center',
                backgroundColor: t.card,
                borderColor: t.border,
                borderRadius: r.rounded2rem,
                borderWidth: 1,
                gap: 12,
                minWidth: 80,
                padding: 20,
                shadowColor: t.primary,
                shadowOpacity: 0.06,
                shadowRadius: 8,
              }}
            >
              <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 12 }}>
                {hour.time}
              </Text>
              <AppIcon name={hour.icon} size={32} color={themeColor(theme, hour.iconColor)} />
              <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 20 }}>
                {formatTemperature(hour.temperature, unit)}
              </Text>
            </View>
          ))}
        </ScrollView>

      </ScrollView>
    </SafeAreaView>
  );
}

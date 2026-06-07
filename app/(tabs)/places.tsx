import { router } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { useShallow } from 'zustand/react/shallow';

import { AppIcon } from '@/components/ui/AppIcon';
import { usePlacesStore } from '@/features/places/placesStore';
import { getWeatherCodeMapping } from '@/features/weather/weatherInterpreter';
import { useWeatherStore } from '@/features/weather/weatherStore';
import type { CityResult } from '@/services/weather/weatherTypes';
import { alpha, themeColor } from '@/theme/colorUtils';
import { sleekTokens, useAppTheme } from '@/theme';

export default function PlacesScreen() {
  const theme = useAppTheme();
  const r = sleekTokens.radii;
  const t = theme.colors;

  const payload             = useWeatherStore(s => s.currentPayload);
  const fetchWeatherForCity = useWeatherStore(s => s.fetchWeatherForCity);
  const setSelectedDay      = useWeatherStore(s => s.setSelectedDay);
  const setSelectedLocation = useWeatherStore(s => s.setSelectedLocation);

  const savedPlaces = usePlacesStore(useShallow(s => s.savedPlaces));
  const removePlace = usePlacesStore(s => s.removePlace);

  // Current location card: live data from store
  const currentCode    = payload?.current.weatherCode ?? 3;
  const currentMapping = getWeatherCodeMapping(currentCode);
  const currentName    = payload?.city.name ?? 'Your Location';
  const currentTemp    = payload?.current.temperature ?? '--';
  const currentRain    = payload?.current.rainProbability ?? 0;
  const currentMood    = payload ? currentMapping.weatherMood : 'Tap to load weather';

  const handleSavedPlaceTap = async (city: CityResult) => {
    setSelectedDay(null);
    setSelectedLocation(city);
    await fetchWeatherForCity(city);
    router.push('/weather-detail');
  };

  return (
    <ScreenBackground edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 128 }}>
        <View style={{ paddingBottom: 24, paddingHorizontal: 24, paddingTop: 12 }}>
          <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 30 }}>
            Saved Places
          </Text>
          <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 16, marginTop: 2 }}>
            Your weather locations
          </Text>
        </View>

        <View style={{ marginBottom: 16, paddingHorizontal: 24, position: 'relative' }}>
          <View style={{ bottom: 0, justifyContent: 'center', left: 40, position: 'absolute', top: 0, zIndex: 1 }}>
            <AppIcon name="solar-magnifer-linear" size={20} color={t.mutedText} />
          </View>
          <TouchableOpacity
            activeOpacity={0.82}
            onPress={() => router.push('/search-city')}
            style={{
              backgroundColor: t.card,
              borderColor: t.border,
              borderRadius: r.rounded3xl,
              borderWidth: 1,
              paddingLeft: 48,
              paddingRight: 16,
              paddingVertical: 16,
              shadowColor: t.primary,
              shadowOpacity: 0.06,
              shadowRadius: 8,
            }}
          >
            <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 16 }}>
              Search city
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 24 }}>
          {/* Current location card */}
          <View
            style={{
              alignItems: 'center',
              backgroundColor: alpha(t.primary, 0.10),
              borderColor: alpha(t.primary, 0.20),
              borderRadius: r.rounded2_5rem,
              borderWidth: 2,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 16,
              padding: 24,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: alpha(t.primary, 0.60),
                  fontFamily: 'Quicksand_700Bold',
                  fontSize: 10,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                }}
              >
                Current Location
              </Text>
              <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 20, marginTop: 2 }}>
                {currentName}
              </Text>
              <Text style={{ color: alpha(t.primary, 0.80), fontFamily: 'Quicksand_700Bold', fontSize: 12, marginTop: 4 }}>
                {currentMood}
              </Text>
            </View>
            <View style={{ alignItems: 'center', flexDirection: 'row', gap: 16 }}>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 30 }}>
                  {currentTemp}°
                </Text>
                <Text
                  style={{
                    color: alpha(t.primary, 0.60),
                    fontFamily: 'Quicksand_700Bold',
                    fontSize: 10,
                    textTransform: 'uppercase',
                  }}
                >
                  {currentRain}% Rain
                </Text>
              </View>
              <AppIcon
                name={currentMapping.iconKey}
                size={40}
                color={themeColor(theme, currentMapping.iconColor)}
              />
            </View>
          </View>

          {/* Saved places */}
          <View style={{ gap: 16, paddingTop: 8 }}>
            {savedPlaces.map((place) => (
              <TouchableOpacity
                key={place.id}
                activeOpacity={0.82}
                onPress={() => handleSavedPlaceTap(place)}
              >
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: t.card,
                    borderColor: t.border,
                    borderRadius: r.rounded2_5rem,
                    borderWidth: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 24,
                    shadowColor: t.primary,
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 20 }}>
                      {place.name}
                    </Text>
                    <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 12, marginTop: 2 }}>
                      {place.region ? `${place.region}, ` : ''}{place.country}
                    </Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.75}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    onPress={() => removePlace(place.id)}
                    style={{
                      alignItems: 'center',
                      backgroundColor: alpha(t.danger, 0.08),
                      borderRadius: r.full,
                      height: 36,
                      justifyContent: 'center',
                      marginLeft: 12,
                      width: 36,
                    }}
                  >
                    <AppIcon name="solar-trash-bin-trash-bold" size={18} color={t.danger} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}

            {savedPlaces.length === 0 && (
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: t.card,
                  borderColor: alpha(t.mutedText, 0.15),
                  borderRadius: r.rounded2_5rem,
                  borderWidth: 1,
                  paddingVertical: 32,
                }}
              >
                <AppIcon name="solar-map-point-wave-bold" size={32} color={alpha(t.mutedText, 0.30)} />
                <Text style={{ color: alpha(t.mutedText, 0.50), fontFamily: 'Quicksand_700Bold', fontSize: 14, marginTop: 8 }}>
                  No saved places yet
                </Text>
              </View>
            )}

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => router.push('/search-city')}
              style={{
                alignItems: 'center',
                backgroundColor: t.card,
                borderColor: alpha(t.mutedText, 0.20),
                borderRadius: r.rounded2_5rem,
                borderStyle: 'dashed',
                borderWidth: 2,
                gap: 4,
                justifyContent: 'center',
                marginTop: 4,
                paddingVertical: 24,
              }}
            >
              <AppIcon name="solar-add-circle-bold" size={28} color={alpha(t.mutedText, 0.40)} />
              <Text style={{ color: alpha(t.mutedText, 0.60), fontFamily: 'Quicksand_700Bold', fontSize: 12 }}>
                Add another city
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

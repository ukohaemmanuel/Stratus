import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { useShallow } from 'zustand/react/shallow';

import { AppIcon } from '@/components/ui/AppIcon';
import { usePlacesStore } from '@/features/places/placesStore';
import { useWeatherStore } from '@/features/weather/weatherStore';
import type { CityResult } from '@/services/weather/weatherTypes';
import { alpha } from '@/theme/colorUtils';
import { sleekTokens, useAppTheme } from '@/theme';

export default function SearchCityScreen() {
  const [query, setQuery] = useState('');
  const theme = useAppTheme();
  const r = sleekTokens.radii;
  const t = theme.colors;

  const storeResults       = useWeatherStore(useShallow(s => s.searchResults));
  const recentSearches     = useWeatherStore(useShallow(s => s.recentSearches));
  const isLoadingSearch    = useWeatherStore(s => s.isLoadingSearch);
  const searchCity         = useWeatherStore(s => s.searchCity);
  const fetchWeatherForCity= useWeatherStore(s => s.fetchWeatherForCity);
  const addRecentSearch    = useWeatherStore(s => s.addRecentSearch);
  const setSelectedLocation= useWeatherStore(s => s.setSelectedLocation);
  const clearSearch        = useWeatherStore(s => s.clearSearch);

  const addPlace = usePlacesStore(s => s.addPlace);
  const isSaved  = usePlacesStore(s => s.isSaved);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      clearSearch();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleQueryChange = (text: string) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchCity(text), 300);
  };

  const handleAddCity = async (result: CityResult) => {
    addRecentSearch(result.name);
    addPlace(result);
    setSelectedLocation(result);
    await fetchWeatherForCity(result);
    router.push('/(tabs)/today');
  };

  const showResults = query.trim().length >= 2;

  return (
    <ScreenBackground edges={['top']}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}
      >
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

          <View style={{ flex: 1, position: 'relative' }}>
            <View style={{ bottom: 0, justifyContent: 'center', left: 16, position: 'absolute', top: 0, zIndex: 1 }}>
              <AppIcon name="solar-magnifer-linear" size={20} color={t.mutedText} />
            </View>
            <TextInput
              autoFocus
              onChangeText={handleQueryChange}
              placeholder="Search city"
              placeholderTextColor={alpha(t.mutedText, 0.60)}
              value={query}
              style={{
                backgroundColor: t.card,
                borderColor: alpha(t.primary, 0.20),
                borderRadius: r.full,
                borderWidth: 2,
                color: t.text,
                fontFamily: 'Quicksand_700Bold',
                fontSize: 16,
                paddingLeft: 48,
                paddingRight: 16,
                paddingVertical: 16,
              }}
            />
          </View>
        </View>

        {/* Recent searches */}
        {!showResults && (
          <View style={{ paddingHorizontal: 24 }}>
            <Text
              style={{
                color: t.mutedText,
                fontFamily: 'Quicksand_700Bold',
                fontSize: 12,
                letterSpacing: 1.5,
                marginBottom: 16,
                textTransform: 'uppercase',
              }}
            >
              Recent Searches
            </Text>
            {recentSearches.length === 0 ? (
              <Text style={{ color: alpha(t.mutedText, 0.6), fontFamily: 'Quicksand_500Medium', fontSize: 14 }}>
                No recent searches yet.
              </Text>
            ) : (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                {recentSearches.map((city) => (
                  <TouchableOpacity
                    key={city}
                    activeOpacity={0.75}
                    onPress={() => handleQueryChange(city)}
                    style={{
                      alignItems: 'center',
                      backgroundColor: t.card,
                      borderColor: t.border,
                      borderRadius: r.full,
                      borderWidth: 1,
                      flexDirection: 'row',
                      gap: 8,
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      shadowColor: t.primary,
                      shadowOpacity: 0.06,
                      shadowRadius: 8,
                    }}
                  >
                    <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 14 }}>
                      {city}
                    </Text>
                    <AppIcon name="solar-close-circle-bold" size={16} color={alpha(t.mutedText, 0.40)} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Search results */}
        {showResults && (
          <View style={{ paddingHorizontal: 24 }}>
            <Text
              style={{
                color: t.mutedText,
                fontFamily: 'Quicksand_700Bold',
                fontSize: 12,
                letterSpacing: 1.5,
                marginBottom: 16,
                textTransform: 'uppercase',
              }}
            >
              Search Results
            </Text>

            {isLoadingSearch && (
              <ActivityIndicator size="small" color={t.primary} style={{ marginVertical: 16 }} />
            )}

            {!isLoadingSearch && storeResults.length === 0 && (
              <Text style={{ color: alpha(t.mutedText, 0.6), fontFamily: 'Quicksand_500Medium', fontSize: 14 }}>
                No cities found.
              </Text>
            )}

            <View style={{ gap: 12 }}>
              {storeResults.map((result) => {
                const saved = isSaved(result.id);
                return (
                  <View
                    key={result.id}
                    style={{
                      alignItems: 'center',
                      backgroundColor: t.card,
                      borderColor: t.border,
                      borderRadius: r.rounded2rem,
                      borderWidth: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      padding: 20,
                      shadowColor: t.primary,
                      shadowOpacity: 0.06,
                      shadowRadius: 8,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 18 }}>
                        {result.name}
                      </Text>
                      <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 12, marginTop: 2 }}>
                        {result.region ? `${result.region}, ` : ''}{result.country}
                      </Text>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.75}
                      onPress={() => handleAddCity(result)}
                      style={{
                        alignItems: 'center',
                        backgroundColor: saved ? alpha(t.primary, 0.12) : t.primary,
                        borderRadius: r.full,
                        height: 40,
                        justifyContent: 'center',
                        shadowColor: t.primary,
                        shadowOpacity: saved ? 0 : 0.20,
                        shadowRadius: 12,
                        width: 40,
                      }}
                    >
                      {saved ? (
                        <AppIcon name="solar-check-circle-bold" size={20} color={t.primary} />
                      ) : (
                        <AppIcon name="material-symbols-add-rounded" size={20} color={t.primaryForeground} />
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

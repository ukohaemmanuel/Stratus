import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/ui/AppIcon';
import { recentSearches, searchResults } from '@/data/mockPlaces';
import { alpha, themeColor } from '@/theme/colorUtils';
import { sleekTokens, useAppTheme } from '@/theme';

export default function SearchCityScreen() {
  const [query, setQuery] = useState('');
  const theme = useAppTheme();
  const r = sleekTokens.radii;
  const t = theme.colors;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.background }} edges={['top']}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}
      >
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
              onChangeText={setQuery}
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
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            {recentSearches.map((city) => (
              <TouchableOpacity
                key={city}
                activeOpacity={0.75}
                onPress={() => setQuery(city)}
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
        </View>

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
          <View style={{ gap: 12 }}>
            {searchResults.map((result) => (
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
                <View>
                  <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 18 }}>
                    {result.city}
                  </Text>
                  <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 12, marginTop: 2 }}>
                    {result.country}
                  </Text>
                </View>
                <View style={{ alignItems: 'center', flexDirection: 'row', gap: 16 }}>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 20 }}>
                      {result.temperature}°
                    </Text>
                    <AppIcon name={result.icon} size={24} color={themeColor(theme, result.iconColor)} />
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => router.back()}
                    style={{
                      alignItems: 'center',
                      backgroundColor: t.primary,
                      borderRadius: r.full,
                      height: 40,
                      justifyContent: 'center',
                      shadowColor: t.primary,
                      shadowOpacity: 0.20,
                      shadowRadius: 12,
                      width: 40,
                    }}
                  >
                    <AppIcon name="material-symbols-add-rounded" size={20} color={t.primaryForeground} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

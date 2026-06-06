import { router } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/ui/AppIcon';
import { mockPlaces } from '@/data/mockPlaces';
import { alpha, themeColor } from '@/theme/colorUtils';
import { sleekTokens, useAppTheme } from '@/theme';

export default function PlacesScreen() {
  const theme = useAppTheme();
  const r = sleekTokens.radii;
  const t = theme.colors;
  const current = mockPlaces.find((p) => p.isCurrent) ?? mockPlaces[0];
  const savedPlaces = mockPlaces.filter((p) => !p.isCurrent);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.background }} edges={['top']}>
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
                {current.city}
              </Text>
              <Text style={{ color: alpha(t.primary, 0.80), fontFamily: 'Quicksand_700Bold', fontSize: 12, marginTop: 4 }}>
                {current.weatherMood}
              </Text>
            </View>
            <View style={{ alignItems: 'center', flexDirection: 'row', gap: 16 }}>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 30 }}>
                  {current.temperature}°
                </Text>
                <Text
                  style={{
                    color: alpha(t.primary, 0.60),
                    fontFamily: 'Quicksand_700Bold',
                    fontSize: 10,
                    textTransform: 'uppercase',
                  }}
                >
                  {current.rainChance}% Rain
                </Text>
              </View>
              <AppIcon name={current.icon} size={40} color={themeColor(theme, current.iconColor)} />
            </View>
          </View>

          <View style={{ gap: 16, paddingTop: 8 }}>
            {savedPlaces.map((place) => (
              <TouchableOpacity
                key={place.id}
                activeOpacity={0.82}
                onPress={() =>
                  router.push({
                    pathname: '/weather-detail',
                    params: { city: place.city, day: 'Today' },
                  })
                }
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
                      {place.city}
                    </Text>
                    <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 10, marginTop: 2 }}>
                      {place.region}
                    </Text>
                    <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 12, marginTop: 8 }}>
                      {place.weatherMood}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'center', flexDirection: 'row', gap: 16 }}>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 24 }}>
                        {place.temperature}°
                      </Text>
                      <Text
                        style={{
                          color: t.mutedText,
                          fontFamily: 'Quicksand_700Bold',
                          fontSize: 10,
                          textTransform: 'uppercase',
                        }}
                      >
                        {place.rainChance}% rain
                      </Text>
                    </View>
                    <AppIcon name={place.icon} size={36} color={themeColor(theme, place.iconColor)} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}

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
    </SafeAreaView>
  );
}

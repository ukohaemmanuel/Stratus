import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/ui/AppIcon';
import { alpha } from '@/theme/colorUtils';
import { sleekTokens, useAppTheme } from '@/theme';

const globeImage = require('../../assets/images/mascots/globe.png');

export default function GlobeScreen() {
  const theme = useAppTheme();
  const r = sleekTokens.radii;
  const t = theme.colors;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.background }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 128 }}>
        <View style={{ paddingBottom: 16, paddingHorizontal: 24, paddingTop: 12, zIndex: 2 }}>
          <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 30 }}>
            Weather Globe
          </Text>
          <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 16, marginTop: 2 }}>
            Explore your saved places
          </Text>

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={() => router.push('/search-city')}
              style={{
                backgroundColor: t.card,
                borderColor: t.border,
                borderRadius: r.full,
                borderWidth: 1,
                flex: 1,
                justifyContent: 'center',
                minHeight: 56,
                paddingLeft: 48,
                paddingRight: 16,
                shadowColor: t.primary,
                shadowOpacity: 0.06,
                shadowRadius: 8,
              }}
            >
              <View style={{ bottom: 0, justifyContent: 'center', left: 16, position: 'absolute', top: 0 }}>
                <AppIcon name="solar-magnifer-linear" size={20} color={t.mutedText} />
              </View>
              <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 14 }}>
                Search city
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.75}
              style={{
                alignItems: 'center',
                backgroundColor: t.card,
                borderColor: t.border,
                borderRadius: r.full,
                borderWidth: 1,
                height: 56,
                justifyContent: 'center',
                shadowColor: t.primary,
                shadowOpacity: 0.06,
                shadowRadius: 8,
                width: 56,
              }}
            >
              <AppIcon name="solar-gps-bold" size={24} color={t.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ alignItems: 'center', justifyContent: 'center', minHeight: 400, position: 'relative' }}>
          <View
            pointerEvents="none"
            style={{
              aspectRatio: 1,
              backgroundColor: alpha(t.primary, 0.10),
              borderRadius: r.full,
              opacity: 0.55,
              position: 'absolute',
              width: '120%',
            }}
          />

          <View style={{ alignItems: 'center', aspectRatio: 1, justifyContent: 'center', maxWidth: 340, position: 'relative', width: '90%' }}>
            <Image source={globeImage} style={{ height: '100%', width: '100%' }} contentFit="contain" />

            <View style={{ alignItems: 'center', height: 32, justifyContent: 'center', position: 'absolute', right: '25%', top: '25%', width: 32 }}>
              <AppIcon name="solar-map-point-bold" size={32} color={t.primary} />
            </View>
            <View style={{ alignItems: 'center', height: 32, justifyContent: 'center', left: '33%', position: 'absolute', top: '50%', width: 32 }}>
              <AppIcon name="solar-map-point-bold" size={28} color={t.success} />
            </View>
            <View style={{ alignItems: 'center', bottom: '25%', height: 32, justifyContent: 'center', left: '50%', position: 'absolute', transform: [{ translateX: 16 }], width: 32 }}>
              <AppIcon name="solar-map-point-bold" size={28} color={t.success} />
            </View>

            <View
              style={{
                alignItems: 'center',
                backgroundColor: t.card,
                borderColor: t.primary,
                borderRadius: r.rounded3xl,
                borderWidth: 2,
                flexDirection: 'row',
                gap: 12,
                left: '50%',
                padding: 12,
                position: 'absolute',
                top: '33%',
                transform: [{ translateX: -70 }, { translateY: -70 }],
                zIndex: 3,
              }}
            >
              <View>
                <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 14 }}>
                  Newcastle
                </Text>
                <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 10 }}>
                  12° · Cloudy
                </Text>
              </View>
              <AppIcon name="solar-clouds-bold" size={20} color={t.primary} />
            </View>
          </View>

          <View style={{ gap: 12, position: 'absolute', right: 24, top: '40%' }}>
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
                shadowOpacity: 0.12,
                shadowRadius: 16,
                width: 48,
              }}
            >
              <AppIcon name="material-symbols-add-rounded" size={24} color={t.text} />
            </TouchableOpacity>
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
                shadowOpacity: 0.12,
                shadowRadius: 16,
                width: 48,
              }}
            >
              <AppIcon name="solar-minus-circle-bold" size={24} color={t.text} />
            </TouchableOpacity>
          </View>

          <Text
            style={{
              color: t.mutedText,
              fontFamily: 'Quicksand_700Bold',
              fontSize: 10,
              letterSpacing: 1.5,
              marginTop: 16,
              textTransform: 'uppercase',
            }}
          >
            Drag to rotate · Pinch to zoom
          </Text>
        </View>

        <View style={{ paddingBottom: 24, paddingHorizontal: 24 }}>
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
              shadowOpacity: 0.12,
              shadowRadius: 20,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 20, lineHeight: 24 }}>
                Newcastle
              </Text>
              <Text style={{ color: t.primary, fontFamily: 'Quicksand_700Bold', fontSize: 12, marginTop: 2 }}>
                Soft cloudy morning
              </Text>
              <View style={{ flexDirection: 'row', gap: 16, marginTop: 12 }}>
                <View>
                  <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 9, letterSpacing: 1, textTransform: 'uppercase' }}>
                    Rain
                  </Text>
                  <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 12 }}>40%</Text>
                </View>
                <View>
                  <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 9, letterSpacing: 1, textTransform: 'uppercase' }}>
                    Wind
                  </Text>
                  <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 12 }}>12 mph</Text>
                </View>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 12 }}>
              <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 36 }}>
                12°
              </Text>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() =>
                  router.push({
                    pathname: '/weather-detail',
                    params: { city: 'Newcastle', day: 'Today' },
                  })
                }
                style={{
                  backgroundColor: t.primary,
                  borderRadius: r.full,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  shadowColor: t.primary,
                  shadowOpacity: 0.20,
                  shadowRadius: 12,
                }}
              >
                <Text style={{ color: t.primaryForeground, fontFamily: 'Quicksand_700Bold', fontSize: 12 }}>
                  View Forecast
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

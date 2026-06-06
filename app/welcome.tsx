import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/ui/AppIcon';
import { alpha } from '@/theme/colorUtils';
import { sleekTokens, useAppTheme } from '@/theme';

const mascotWelcome = require('../assets/images/mascots/mascot-welcome.png');

export default function WelcomeScreen() {
  const theme = useAppTheme();
  const r = sleekTokens.radii;
  const t = theme.colors;

  return (
    <LinearGradient colors={[t.background, t.backgroundAlt]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View
          style={{
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
            padding: 32,
          }}
        >
          <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center', maxWidth: 384, width: '100%' }}>
            <View
              style={{
                height: 320,
                marginBottom: 24,
                position: 'relative',
                width: 320,
              }}
            >
              <View
                style={{
                  backgroundColor: alpha(t.primary, 0.20),
                  borderRadius: r.full,
                  bottom: 0,
                  left: 0,
                  position: 'absolute',
                  right: 0,
                  top: 0,
                }}
              />
              <Image source={mascotWelcome} style={{ height: 320, width: 320 }} contentFit="contain" />
            </View>

            <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 48, lineHeight: 52, marginBottom: 16, textAlign: 'center' }}>
              Stratus
            </Text>
            <Text
              style={{
                color: alpha(t.text, 0.80),
                fontFamily: 'Quicksand_700Bold',
                fontSize: 24,
                lineHeight: 30,
                marginBottom: 16,
                textAlign: 'center',
              }}
            >
              Weather with personality
            </Text>
            <Text
              style={{
                color: t.mutedText,
                fontFamily: 'Quicksand_500Medium',
                fontSize: 18,
                lineHeight: 27,
                marginBottom: 40,
                paddingHorizontal: 24,
                textAlign: 'center',
              }}
            >
              Check the forecast, understand what today feels like, and get tiny weather tips for your day.
            </Text>

            <View style={{ gap: 16, width: '100%' }}>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => router.replace('/(tabs)/today')}
                style={{
                  alignItems: 'center',
                  backgroundColor: t.primary,
                  borderRadius: r.full,
                  flexDirection: 'row',
                  gap: 12,
                  justifyContent: 'center',
                  paddingVertical: 20,
                  shadowColor: t.primary,
                  shadowOpacity: 0.30,
                  shadowRadius: 16,
                  width: '100%',
                }}
              >
                <AppIcon name="solar-map-point-bold" size={28} color={t.primaryForeground} />
                <Text style={{ color: t.primaryForeground, fontFamily: 'Quicksand_700Bold', fontSize: 20 }}>
                  Use my location
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => router.replace('/search-city')}
                style={{
                  alignItems: 'center',
                  borderRadius: r.full,
                  paddingVertical: 16,
                  width: '100%',
                }}
              >
                <Text style={{ color: t.primary, fontFamily: 'Quicksand_700Bold', fontSize: 18 }}>
                  Search city instead
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text
            style={{
              color: t.mutedText,
              fontFamily: 'Quicksand_700Bold',
              fontSize: 12,
              letterSpacing: 1,
              paddingBottom: 16,
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            Location is only used to show your local weather.
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

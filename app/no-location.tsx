import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/ui/AppIcon';
import { alpha } from '@/theme/colorUtils';
import { sleekTokens, useAppTheme } from '@/theme';

const mascotNoLocation = require('../assets/images/mascots/mascot-no-location.png');

export default function NoLocationScreen() {
  const theme = useAppTheme();
  const r = sleekTokens.radii;
  const t = theme.colors;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.background }} edges={['top', 'bottom']}>
      <View
        style={{
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
          padding: 32,
        }}
      >
        <View style={{ alignItems: 'center', maxWidth: 384, width: '100%' }}>
          <View
            style={{
              height: 256,
              marginBottom: 32,
              position: 'relative',
              width: 256,
            }}
          >
            <View
              style={{
                backgroundColor: alpha(t.muted, 0.20),
                borderRadius: r.full,
                bottom: 0,
                left: 0,
                position: 'absolute',
                right: 0,
                top: 0,
              }}
            />
            <Image source={mascotNoLocation} style={{ height: 256, width: 256 }} contentFit="contain" />
          </View>

          <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 36, marginBottom: 12, textAlign: 'center' }}>
            No location yet
          </Text>
          <Text
            style={{
              color: t.mutedText,
              fontFamily: 'Quicksand_700Bold',
              fontSize: 18,
              lineHeight: 27,
              marginBottom: 40,
              textAlign: 'center',
            }}
          >
            Search for a city to see your weather without using location.
          </Text>

          <View style={{ gap: 16, width: '100%' }}>
            <View style={{ position: 'relative' }}>
              <View style={{ bottom: 0, justifyContent: 'center', left: 24, position: 'absolute', top: 0, zIndex: 1 }}>
                <AppIcon name="solar-magnifer-linear" size={20} color={t.mutedText} />
              </View>
              <TextInput
                onSubmitEditing={() => router.push('/search-city')}
                placeholder="Search city"
                placeholderTextColor={alpha(t.mutedText, 0.60)}
                style={{
                  backgroundColor: t.card,
                  borderColor: t.border,
                  borderRadius: r.full,
                  borderWidth: 2,
                  color: t.text,
                  fontFamily: 'Quicksand_700Bold',
                  fontSize: 18,
                  paddingLeft: 56,
                  paddingRight: 24,
                  paddingVertical: 20,
                  shadowColor: t.primary,
                  shadowOpacity: 0.06,
                  shadowRadius: 8,
                }}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => router.push('/search-city')}
              style={{
                alignItems: 'center',
                backgroundColor: t.primary,
                borderRadius: r.full,
                paddingVertical: 20,
                shadowColor: t.primary,
                shadowOpacity: 0.20,
                shadowRadius: 14,
                width: '100%',
              }}
            >
              <Text style={{ color: t.primaryForeground, fontFamily: 'Quicksand_700Bold', fontSize: 20 }}>
                Search city
              </Text>
            </TouchableOpacity>
          </View>

          <Text
            style={{
              color: alpha(t.mutedText, 0.70),
              fontFamily: 'Quicksand_700Bold',
              fontSize: 10,
              letterSpacing: 1.5,
              marginTop: 32,
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            You can enable location later in Settings.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

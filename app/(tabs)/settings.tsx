import { router } from 'expo-router';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/ui/AppIcon';
import { usePreferencesStore } from '@/features/preferences/preferencesStore';
import { alpha } from '@/theme/colorUtils';
import { sleekTokens, useAppTheme } from '@/theme';

function Divider({ color }: { color: string }) {
  return <View style={{ backgroundColor: color, height: 1 }} />;
}

function SectionHeader({ label }: { label: string }) {
  const theme = useAppTheme();
  return (
    <Text
      style={{
        color: theme.colors.mutedText,
        fontFamily: 'Quicksand_700Bold',
        fontSize: 12,
        letterSpacing: 1.5,
        marginBottom: 16,
        paddingHorizontal: 16,
        textTransform: 'uppercase',
      }}
    >
      {label}
    </Text>
  );
}

export default function SettingsScreen() {
  const theme = useAppTheme();
  const r = sleekTokens.radii;
  const t = theme.colors;

  const temperatureUnit    = usePreferencesStore(s => s.temperatureUnit);
  const weatherTone        = usePreferencesStore(s => s.weatherTone);
  const hapticsEnabled     = usePreferencesStore(s => s.hapticsEnabled);
  const useCurrentLocation = usePreferencesStore(s => s.useCurrentLocation);
  const setTemperatureUnit    = usePreferencesStore(s => s.setTemperatureUnit);
  const setWeatherTone        = usePreferencesStore(s => s.setWeatherTone);
  const setHapticsEnabled     = usePreferencesStore(s => s.setHapticsEnabled);
  const setUseCurrentLocation = usePreferencesStore(s => s.setUseCurrentLocation);

  const isCelsius    = temperatureUnit === 'celsius';
  const isPlayful    = weatherTone === 'playful';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.background }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 128 }}>
        <View style={{ paddingBottom: 24, paddingHorizontal: 24, paddingTop: 12 }}>
          <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 30 }}>
            Settings
          </Text>
        </View>

        <View style={{ paddingHorizontal: 24 }}>

          {/* ── Preferences ───────────────────────────── */}
          <SectionHeader label="Preferences" />
          <View
            style={{
              backgroundColor: t.card,
              borderColor: t.border,
              borderRadius: r.rounded2_5rem,
              borderWidth: 1,
              marginBottom: 32,
              overflow: 'hidden',
              shadowColor: t.primary,
              shadowOpacity: 0.06,
              shadowRadius: 8,
            }}
          >
            {/* Temperature unit */}
            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
              <View style={{ alignItems: 'center', flexDirection: 'row', gap: 16 }}>
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: alpha(t.primary, 0.10),
                    borderRadius: r.rounded2xl,
                    height: 44,
                    justifyContent: 'center',
                    width: 44,
                  }}
                >
                  <AppIcon name="solar-thermometer-bold" size={22} color={t.primary} />
                </View>
                <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 16 }}>
                  Temperature unit
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: t.background,
                  borderColor: alpha(t.border, 0.5),
                  borderRadius: r.rounded2xl,
                  borderWidth: 1,
                  flexDirection: 'row',
                  padding: 6,
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => setTemperatureUnit('celsius')}
                  style={{
                    backgroundColor: isCelsius ? t.card : 'transparent',
                    borderColor: isCelsius ? alpha(t.border, 0.10) : 'transparent',
                    borderRadius: 12,
                    borderWidth: 1,
                    paddingHorizontal: 20,
                    paddingVertical: 8,
                  }}
                >
                  <Text style={{ color: isCelsius ? t.text : t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 12 }}>
                    °C
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => setTemperatureUnit('fahrenheit')}
                  style={{
                    backgroundColor: !isCelsius ? t.card : 'transparent',
                    borderColor: !isCelsius ? alpha(t.border, 0.10) : 'transparent',
                    borderRadius: 12,
                    borderWidth: 1,
                    paddingHorizontal: 20,
                    paddingVertical: 8,
                  }}
                >
                  <Text style={{ color: !isCelsius ? t.text : t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 12 }}>
                    °F
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Divider color={t.border} />

            {/* Weather tone */}
            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
              <View style={{ alignItems: 'center', flexDirection: 'row', gap: 16 }}>
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: alpha(t.secondary, 0.10),
                    borderRadius: r.rounded2xl,
                    height: 44,
                    justifyContent: 'center',
                    width: 44,
                  }}
                >
                  <AppIcon name="solar-chat-round-dots-bold" size={22} color={t.secondary} />
                </View>
                <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 16 }}>
                  Weather tone
                </Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => setWeatherTone('playful')}
                  style={{
                    backgroundColor: isPlayful ? alpha(t.primary, 0.10) : 'transparent',
                    borderColor: isPlayful ? alpha(t.primary, 0.20) : t.border,
                    borderRadius: r.full,
                    borderWidth: 1,
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                  }}
                >
                  <Text style={{ color: isPlayful ? t.primary : t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 13 }}>
                    Playful
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => setWeatherTone('simple')}
                  style={{
                    backgroundColor: !isPlayful ? alpha(t.primary, 0.10) : 'transparent',
                    borderColor: !isPlayful ? alpha(t.primary, 0.20) : t.border,
                    borderRadius: r.full,
                    borderWidth: 1,
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                  }}
                >
                  <Text style={{ color: !isPlayful ? t.primary : t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 13 }}>
                    Simple
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Divider color={t.border} />

            {/* Haptics */}
            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
              <View style={{ alignItems: 'center', flexDirection: 'row', gap: 16 }}>
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: alpha(t.accent, 0.10),
                    borderRadius: r.rounded2xl,
                    height: 44,
                    justifyContent: 'center',
                    width: 44,
                  }}
                >
                  <AppIcon name="solar-bell-bold" size={22} color={t.accent} />
                </View>
                <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 16 }}>
                  Haptics
                </Text>
              </View>
              <Switch
                value={hapticsEnabled}
                onValueChange={setHapticsEnabled}
                trackColor={{ false: alpha(t.mutedText, 0.20), true: t.primary }}
                thumbColor={t.card}
              />
            </View>
          </View>

          {/* ── Location ───────────────────────────────── */}
          <SectionHeader label="Location" />
          <View
            style={{
              backgroundColor: t.card,
              borderColor: t.border,
              borderRadius: r.rounded2_5rem,
              borderWidth: 1,
              marginBottom: 32,
              overflow: 'hidden',
              shadowColor: t.primary,
              shadowOpacity: 0.06,
              shadowRadius: 8,
            }}
          >
            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
              <View style={{ alignItems: 'center', flexDirection: 'row', gap: 16 }}>
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: alpha(t.primary, 0.10),
                    borderRadius: r.rounded2xl,
                    height: 44,
                    justifyContent: 'center',
                    width: 44,
                  }}
                >
                  <AppIcon name="solar-gps-bold" size={22} color={t.primary} />
                </View>
                <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 16 }}>
                  Use current location
                </Text>
              </View>
              <Switch
                value={useCurrentLocation}
                onValueChange={setUseCurrentLocation}
                trackColor={{ false: alpha(t.mutedText, 0.20), true: t.primary }}
                thumbColor={t.card}
              />
            </View>

            <Divider color={t.border} />

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => router.push('/(tabs)/places')}
              style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}
            >
              <View style={{ alignItems: 'center', flexDirection: 'row', gap: 16 }}>
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: alpha(t.muted, 0.50),
                    borderRadius: r.rounded2xl,
                    height: 44,
                    justifyContent: 'center',
                    width: 44,
                  }}
                >
                  <AppIcon name="solar-map-point-wave-bold" size={22} color={t.mutedText} />
                </View>
                <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 16 }}>
                  Manage saved places
                </Text>
              </View>
              <AppIcon name="solar-alt-arrow-right-bold" size={20} color={alpha(t.mutedText, 0.50)} />
            </TouchableOpacity>
          </View>

          {/* ── Privacy ───────────────────────────────── */}
          <SectionHeader label="Privacy" />
          <View
            style={{
              backgroundColor: alpha(t.primary, 0.05),
              borderColor: alpha(t.primary, 0.10),
              borderRadius: r.rounded2_5rem,
              borderWidth: 1,
              flexDirection: 'row',
              gap: 16,
              marginBottom: 32,
              padding: 24,
            }}
          >
            <AppIcon name="solar-shield-check-bold" size={24} color={t.primary} />
            <Text style={{ color: alpha(t.primary, 0.80), flex: 1, fontFamily: 'Quicksand_700Bold', fontSize: 14, lineHeight: 20 }}>
              Your preferences stay on this device. Weather data is fetched locally. No account is required to use Stratus.
            </Text>
          </View>

          <View style={{ alignItems: 'center', paddingTop: 16 }}>
            <View style={{ flexDirection: 'row', gap: 24 }}>
              {['Privacy', 'Terms', 'About'].map((link) => (
                <TouchableOpacity key={link} activeOpacity={0.75}>
                  <Text
                    style={{
                      color: t.mutedText,
                      fontFamily: 'Quicksand_700Bold',
                      fontSize: 12,
                      letterSpacing: 1.5,
                      textTransform: 'uppercase',
                    }}
                  >
                    {link}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text
              style={{
                color: alpha(t.mutedText, 0.40),
                fontFamily: 'Quicksand_700Bold',
                fontSize: 10,
                letterSpacing: 1,
                marginTop: 16,
                textTransform: 'uppercase',
              }}
            >
              STRATUS v1.0.0 (BETA)
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

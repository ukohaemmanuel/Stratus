import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';

import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { AppIcon } from '@/components/ui/AppIcon';
import { useAppearanceStore } from '@/features/appearance/appearanceStore';
import {
  copyBackgroundToAppStorage,
  deleteCustomBackground,
  pickCustomBackgroundImage,
} from '@/features/appearance/customBackground';
import { ACCENT_PRESETS } from '@/features/appearance/appearanceTypes';
import { usePreferencesStore } from '@/features/preferences/preferencesStore';
import { alpha } from '@/theme/colorUtils';
import { sleekTokens, useAppTheme } from '@/theme';
import type { ThemeId } from '@/theme/themeTypes';
import type { BackgroundMode } from '@/theme/themeTypes';

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

const THEME_OPTIONS: { id: ThemeId; label: string; emoji: string }[] = [
  { id: 'soft-sky',    label: 'Soft Sky',    emoji: '☁️' },
  { id: 'night-cloud', label: 'Night Cloud',  emoji: '🌙' },
  { id: 'race-day',    label: 'Race Day',     emoji: '🏁' },
];

const BG_MODE_OPTIONS: { id: BackgroundMode; label: string }[] = [
  { id: 'theme',   label: 'Theme' },
  { id: 'weather', label: 'Weather' },
  { id: 'time',    label: 'Time' },
  { id: 'custom',  label: 'Custom' },
];

export default function SettingsScreen() {
  const theme = useAppTheme();
  const r = sleekTokens.radii;
  const t = theme.colors;

  // Preferences store
  const temperatureUnit    = usePreferencesStore(s => s.temperatureUnit);
  const weatherTone        = usePreferencesStore(s => s.weatherTone);
  const hapticsEnabled     = usePreferencesStore(s => s.hapticsEnabled);
  const useCurrentLocation = usePreferencesStore(s => s.useCurrentLocation);
  const setTemperatureUnit    = usePreferencesStore(s => s.setTemperatureUnit);
  const setWeatherTone        = usePreferencesStore(s => s.setWeatherTone);
  const setHapticsEnabled     = usePreferencesStore(s => s.setHapticsEnabled);
  const setUseCurrentLocation = usePreferencesStore(s => s.setUseCurrentLocation);

  // Appearance store
  const selectedThemeId      = useAppearanceStore(s => s.selectedThemeId);
  const accentColourId       = useAppearanceStore(s => s.accentColourId);
  const backgroundMode       = useAppearanceStore(s => s.backgroundMode);
  const customBackgroundUri  = useAppearanceStore(s => s.customBackgroundUri);
  const overlayOpacity       = useAppearanceStore(s => s.overlayOpacity);
  const blurEnabled          = useAppearanceStore(s => s.blurEnabled);
  const setTheme             = useAppearanceStore(s => s.setTheme);
  const setAccentColour      = useAppearanceStore(s => s.setAccentColour);
  const setBackgroundMode    = useAppearanceStore(s => s.setBackgroundMode);
  const setCustomBgUri       = useAppearanceStore(s => s.setCustomBackgroundUri);
  const setOverlayOpacity    = useAppearanceStore(s => s.setOverlayOpacity);
  const setBlurEnabled       = useAppearanceStore(s => s.setBlurEnabled);
  const resetAppearance      = useAppearanceStore(s => s.resetAppearance);

  const isCelsius = temperatureUnit === 'celsius';
  const isPlayful = weatherTone === 'playful';

  const [bgPickError, setBgPickError] = useState<string | null>(null);
  const [bgPickLoading, setBgPickLoading] = useState(false);

  const handlePickImage = async () => {
    setBgPickError(null);
    setBgPickLoading(true);
    const pickerUri = await pickCustomBackgroundImage();
    if (!pickerUri) {
      setBgPickError('Permission denied or cancelled.');
      setBgPickLoading(false);
      return;
    }
    const storedUri = await copyBackgroundToAppStorage(pickerUri);
    if (!storedUri) {
      setBgPickError('Could not save image. Try again.');
      setBgPickLoading(false);
      return;
    }
    setCustomBgUri(storedUri);
    setBackgroundMode('custom');
    setBgPickLoading(false);
  };

  const handleRemoveImage = async () => {
    if (customBackgroundUri) await deleteCustomBackground(customBackgroundUri);
    setCustomBgUri(null);
    setBackgroundMode('theme');
    setBgPickError(null);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Appearance',
      'This will restore all appearance settings to their defaults.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            if (customBackgroundUri) deleteCustomBackground(customBackgroundUri);
            resetAppearance();
          },
        },
      ]
    );
  };

  const overlayPercent = Math.round(overlayOpacity * 100);
  const stepOverlay = (delta: number) => {
    const next = Math.min(0.65, Math.max(0.15, Math.round((overlayOpacity + delta) * 100) / 100));
    setOverlayOpacity(next);
  };

  return (
    <ScreenBackground edges={['top']}>
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

          {/* ── App Appearance ─────────────────────────── */}
          <SectionHeader label="App Appearance" />
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
            {/* Theme Pack */}
            <View style={{ padding: 20 }}>
              <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 11, letterSpacing: 1.2, marginBottom: 12, textTransform: 'uppercase' }}>
                Theme Pack
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {THEME_OPTIONS.map((opt) => {
                  const active = selectedThemeId === opt.id;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      activeOpacity={0.75}
                      onPress={() => setTheme(opt.id)}
                      style={{
                        alignItems: 'center',
                        backgroundColor: active ? alpha(t.primary, 0.10) : t.background,
                        borderColor: active ? alpha(t.primary, 0.30) : t.border,
                        borderRadius: r.rounded2xl,
                        borderWidth: active ? 2 : 1,
                        flex: 1,
                        gap: 4,
                        paddingVertical: 12,
                      }}
                    >
                      <Text style={{ fontSize: 18 }}>{opt.emoji}</Text>
                      <Text style={{ color: active ? t.primary : t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 11, textAlign: 'center' }}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <Divider color={t.border} />

            {/* Accent Colour */}
            <View style={{ padding: 20 }}>
              <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 11, letterSpacing: 1.2, marginBottom: 12, textTransform: 'uppercase' }}>
                Accent Colour
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {ACCENT_PRESETS.map((preset) => {
                  const active = accentColourId === preset.id;
                  return (
                    <TouchableOpacity
                      key={preset.id}
                      activeOpacity={0.8}
                      onPress={() => setAccentColour(preset.id)}
                      style={{ alignItems: 'center', gap: 4 }}
                    >
                      <View
                        style={{
                          alignItems: 'center',
                          backgroundColor: preset.hex,
                          borderColor: active ? t.card : 'transparent',
                          borderRadius: r.full,
                          borderWidth: active ? 2 : 0,
                          height: 36,
                          justifyContent: 'center',
                          shadowColor: preset.hex,
                          shadowOpacity: active ? 0.40 : 0,
                          shadowRadius: 8,
                          width: 36,
                        }}
                      >
                        {active && (
                          <View style={{ backgroundColor: '#fff', borderRadius: r.full, height: 10, width: 10 }} />
                        )}
                      </View>
                      <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 10 }}>
                        {preset.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <Divider color={t.border} />

            {/* Background Mode */}
            <View style={{ padding: 20 }}>
              <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 11, letterSpacing: 1.2, marginBottom: 12, textTransform: 'uppercase' }}>
                Background
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {BG_MODE_OPTIONS.map((opt) => {
                  const active = backgroundMode === opt.id;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      activeOpacity={0.75}
                      onPress={() => setBackgroundMode(opt.id)}
                      style={{
                        backgroundColor: active ? alpha(t.primary, 0.10) : t.background,
                        borderColor: active ? alpha(t.primary, 0.30) : t.border,
                        borderRadius: r.full,
                        borderWidth: active ? 2 : 1,
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                      }}
                    >
                      <Text style={{ color: active ? t.primary : t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 13 }}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Custom image controls */}
              {backgroundMode === 'custom' && (
                <View style={{ gap: 8, marginTop: 12 }}>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      activeOpacity={0.75}
                      disabled={bgPickLoading}
                      onPress={handlePickImage}
                      style={{
                        backgroundColor: alpha(t.primary, 0.10),
                        borderColor: alpha(t.primary, 0.20),
                        borderRadius: r.full,
                        borderWidth: 1,
                        flex: 1,
                        paddingVertical: 10,
                      }}
                    >
                      <Text style={{ color: t.primary, fontFamily: 'Quicksand_700Bold', fontSize: 13, textAlign: 'center' }}>
                        {bgPickLoading ? 'Saving…' : customBackgroundUri ? 'Change Image' : 'Choose Image'}
                      </Text>
                    </TouchableOpacity>
                    {customBackgroundUri ? (
                      <TouchableOpacity
                        activeOpacity={0.75}
                        onPress={handleRemoveImage}
                        style={{
                          backgroundColor: alpha(t.danger, 0.08),
                          borderColor: alpha(t.danger, 0.20),
                          borderRadius: r.full,
                          borderWidth: 1,
                          flex: 1,
                          paddingVertical: 10,
                        }}
                      >
                        <Text style={{ color: t.danger, fontFamily: 'Quicksand_700Bold', fontSize: 13, textAlign: 'center' }}>
                          Remove Image
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                  {bgPickError ? (
                    <Text style={{ color: t.danger, fontFamily: 'Quicksand_700Bold', fontSize: 12 }}>
                      {bgPickError}
                    </Text>
                  ) : null}
                  {customBackgroundUri ? (
                    <Text style={{ color: alpha(t.mutedText, 0.60), fontFamily: 'Quicksand_700Bold', fontSize: 11 }}>
                      Custom image saved to device.
                    </Text>
                  ) : (
                    <Text style={{ color: alpha(t.mutedText, 0.60), fontFamily: 'Quicksand_700Bold', fontSize: 11 }}>
                      No image selected yet.
                    </Text>
                  )}
                </View>
              )}
            </View>

            <Divider color={t.border} />

            {/* Overlay opacity */}
            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
              <View>
                <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 16 }}>
                  Dim Strength
                </Text>
                <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 12, marginTop: 2 }}>
                  For custom image backgrounds
                </Text>
              </View>
              <View style={{ alignItems: 'center', flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => stepOverlay(-0.05)}
                  style={{
                    alignItems: 'center',
                    backgroundColor: t.background,
                    borderColor: t.border,
                    borderRadius: r.full,
                    borderWidth: 1,
                    height: 36,
                    justifyContent: 'center',
                    width: 36,
                  }}
                >
                  <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 18 }}>−</Text>
                </TouchableOpacity>
                <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 16, minWidth: 40, textAlign: 'center' }}>
                  {overlayPercent}%
                </Text>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => stepOverlay(0.05)}
                  style={{
                    alignItems: 'center',
                    backgroundColor: t.background,
                    borderColor: t.border,
                    borderRadius: r.full,
                    borderWidth: 1,
                    height: 36,
                    justifyContent: 'center',
                    width: 36,
                  }}
                >
                  <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 18 }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Divider color={t.border} />

            {/* Blur toggle */}
            <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
              <View>
                <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 16 }}>
                  Blur Background
                </Text>
                <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 12, marginTop: 2 }}>
                  Subtle frosted effect
                </Text>
              </View>
              <Switch
                value={blurEnabled}
                onValueChange={setBlurEnabled}
                trackColor={{ false: alpha(t.mutedText, 0.20), true: t.primary }}
                thumbColor={t.card}
              />
            </View>

            <Divider color={t.border} />

            {/* Reset Appearance */}
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={handleReset}
              style={{ alignItems: 'center', padding: 20 }}
            >
              <Text style={{ color: t.danger, fontFamily: 'Quicksand_700Bold', fontSize: 15 }}>
                Reset Appearance
              </Text>
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
    </ScreenBackground>
  );
}

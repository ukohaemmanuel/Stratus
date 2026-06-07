import { LinearGradient } from 'expo-linear-gradient';
import type { PropsWithChildren } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import type { Edge } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppearanceStore } from '@/features/appearance/appearanceStore';
import { resolveAppBackground } from '@/features/appearance/backgroundResolver';
import { useWeatherStore } from '@/features/weather/weatherStore';
import { useAppTheme } from '@/theme';

type ScreenBackgroundProps = PropsWithChildren<{
  edges?: Edge[];
}>;

export function ScreenBackground({ children, edges = ['top'] }: ScreenBackgroundProps) {
  const theme              = useAppTheme();
  const backgroundMode     = useAppearanceStore((s) => s.backgroundMode);
  const customBackgroundUri= useAppearanceStore((s) => s.customBackgroundUri);
  const overlayOpacity     = useAppearanceStore((s) => s.overlayOpacity);
  const weatherCode        = useWeatherStore((s) => s.currentPayload?.current.weatherCode);

  const bg = resolveAppBackground({
    theme,
    backgroundMode,
    currentWeatherCode: weatherCode,
    customBackgroundUri,
  });

  if (bg.type === 'image') {
    return (
      <ImageBackground source={{ uri: bg.uri }} style={styles.fill}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000', opacity: overlayOpacity }]} />
        <SafeAreaView style={styles.transparent} edges={edges}>
          {children}
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (bg.type === 'gradient') {
    return (
      <LinearGradient colors={bg.colors} style={styles.fill}>
        <SafeAreaView style={styles.transparent} edges={edges}>
          {children}
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // type === 'color'
  return (
    <SafeAreaView style={[styles.fill, { backgroundColor: bg.color }]} edges={edges}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill:        { flex: 1 },
  transparent: { flex: 1, backgroundColor: 'transparent' },
});

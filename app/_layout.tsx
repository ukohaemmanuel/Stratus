import {
  Quicksand_400Regular,
  Quicksand_500Medium,
  Quicksand_700Bold,
} from '@expo-google-fonts/quicksand';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import { useAppearanceStore } from '@/features/appearance/appearanceStore';
import { usePlacesStore } from '@/features/places/placesStore';
import { usePreferencesStore } from '@/features/preferences/preferencesStore';
import { useWeatherStore } from '@/features/weather/weatherStore';
import { ThemeProvider, useAppTheme } from '@/theme';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Quicksand_400Regular,
    Quicksand_500Medium,
    Quicksand_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <AppBootstrap />
    </ThemeProvider>
  );
}

function AppBootstrap() {
  const theme = useAppTheme();
  const [allHydrated, setAllHydrated] = useState(false);
  const startedRef = useRef(false);

  const prefsHydrated      = usePreferencesStore(s => s._hasHydrated);
  const appearanceHydrated = useAppearanceStore(s => s._hasHydrated);
  const placesHydrated     = usePlacesStore(s => s._hasHydrated);
  const weatherHydrated    = useWeatherStore(s => s._hasHydrated);

  // Once all stores have rehydrated, load cache and kick off background fetch
  useEffect(() => {
    if (!prefsHydrated || !appearanceHydrated || !placesHydrated || !weatherHydrated) return;
    if (startedRef.current) return;
    startedRef.current = true;

    setAllHydrated(true);

    async function startup() {
      const { selectedLocation, loadCachedWeather, fetchWeatherForCity, fetchWeatherForCurrentLocation } =
        useWeatherStore.getState();

      if (selectedLocation) {
        // Show cached data immediately, then refresh in background
        await loadCachedWeather(selectedLocation.id);
        fetchWeatherForCity(selectedLocation);
      } else {
        fetchWeatherForCurrentLocation();
      }
    }

    startup();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefsHydrated, appearanceHydrated, placesHydrated, weatherHydrated]);

  // Blank background while stores hydrate (< 50 ms on SQLite, imperceptible)
  if (!allHydrated) {
    return <View style={{ flex: 1, backgroundColor: theme.colors.background }} />;
  }

  return <RootNavigator />;
}

function RootNavigator() {
  const theme = useAppTheme();
  const statusBarStyle =
    theme.backgroundStyle.type === 'dark' || theme.backgroundStyle.type === 'sport'
      ? 'light'
      : 'dark';

  return (
    <>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: theme.colors.background },
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="weather-detail" options={{ headerShown: false }} />
        <Stack.Screen name="search-city" options={{ headerShown: false }} />
        <Stack.Screen name="no-location" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={statusBarStyle} />
    </>
  );
}

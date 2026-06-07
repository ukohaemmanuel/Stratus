# Stratus — Implementation Status

Last updated: 2026-06-07 (Stage 6)
Project: Expo SDK 55 weather app (React Native, Expo Router, TypeScript)
Repo: https://github.com/ukohaemmanuel/Stratus

---

## Stack

| Layer | Library | Version |
|---|---|---|
| Framework | Expo SDK | 55 |
| Router | Expo Router | file-based, 5-tab layout |
| UI | React Native + expo-image | — |
| State | Zustand | 5.0.14 |
| Validation | Zod | 4.4.3 |
| Location | expo-location | ~55.1.10 |
| Fonts | Quicksand_700Bold (expo-google-fonts) | — |
| Weather API | Open-Meteo (no key required) | — |

Path aliases: `@/*` → `src/*`, `@/assets/*` → `assets/*`

---

## Stages Completed

### Stage 1–3 — Scaffold + Design System + Screens (pre-existing)
All five tabs exist with full UI using mock data:
- `app/(tabs)/today.tsx` — comfort score, essentials, should-I cards, hourly forecast
- `app/(tabs)/forecast.tsx` — 7-day list + 16-day horizontal outlook
- `app/(tabs)/globe.tsx` — decorative globe with location card
- `app/(tabs)/places.tsx` — current location + saved places list
- `app/weather-detail.tsx` — day detail with metrics + hourly timeline
- `app/search-city.tsx` — city search with recent searches

Design tokens live in `src/theme/`. Icon registry in `src/assets/icons.ts` (37 keys). All screens use `Quicksand_700Bold` and `useAppTheme()`.

---

### Stage 4 — Open-Meteo Live Weather Integration (COMPLETE)

Committed: 6782f5e — "feat(stage-4): wire Open-Meteo live weather across all screens"

#### New files

| File | Purpose |
|---|---|
| `src/services/weather/weatherTypes.ts` | Zod schemas for raw API responses + domain model types (WeatherPayload, CurrentConditions, HourlySlice, DailySlice, CityResult) |
| `src/services/weather/weatherCodeMap.ts` | Maps all WMO weather codes to { conditionLabel, iconKey, iconColor, weatherMood, simpleToneLabel, labelColor }. getWeatherCodeMapping(code) with fallback to code 3. |
| `src/services/weather/openMeteoClient.ts` | Raw fetch wrappers: fetchGeocodingRaw() (10 s timeout) and fetchForecastRaw() (15 s timeout). Requests forecast_days=16, timezone=auto, wind_speed_unit=mph. Validates with Zod. |
| `src/services/weather/weatherService.ts` | searchCities(query) and getWeatherForCoordinates(lat, lon, cityName). Extracts current hour with regex (not new Date() on API strings — UTC risk). Slices hourly (next 12), daily (days 0-6), outlook (days 7-15). |
| `src/features/weather/weatherInterpreter.ts` | Pure functions: getComfortScore(), getEssentials(), getShouldICards(), buildForecastDays(), buildOutlookDays(), buildHourlyForecast(), buildCurrentWeatherDisplay(). No side effects. |
| `src/features/weather/weatherStore.ts` | Zustand store (same pattern as appearanceStore.ts). State: currentPayload, searchResults, recentSearches (max 5), selectedDayIndex, isLoadingCurrent, isLoadingSearch, error. Actions: fetchWeatherForCurrentLocation, fetchWeatherForCity, searchCity, clearSearch, setSelectedDay, addRecentSearch, clearError. |

#### Updated screens

| File | Change |
|---|---|
| `app/(tabs)/today.tsx` | Fetches location on mount (Strict Mode guarded with useRef). Live data from store with mock fallback. Loading spinner + error banner. |
| `app/(tabs)/forecast.tsx` | 7-day and 16-day from store. Day tap: setSelectedDay(index) then router.push('/weather-detail'). |
| `app/weather-detail.tsx` | Reads selectedDayIndex from store. null = today view, number = specific day. |
| `app/(tabs)/places.tsx` | Current location card from live store. Saved place tap builds CityResult and calls fetchWeatherForCity. |
| `app/(tabs)/globe.tsx` | City, temp, rain, wind from store. GPS button calls fetchWeatherForCurrentLocation(). View Forecast: setSelectedDay(null) then weather-detail. |
| `app/search-city.tsx` | 300 ms debounced search. Recent searches from store. Add button: addRecentSearch + fetchWeatherForCity + router.back(). |

#### Key implementation notes

- Mock fallback: currentPayload starts as null. Every screen checks payload ? buildX(payload) : mockData. API failure leaves currentPayload unchanged so UI stays on mock.
- Selected day navigation: stored in Zustand (selectedDayIndex: number | null), not route params.
- Zustand 5 + arrays: searchResults and recentSearches use useShallow from zustand/react/shallow to prevent infinite re-renders.
- Hourly times from Open-Meteo are local (no tz suffix). Hour extracted with regex /T(\d{2}):/ not new Date().
- Day names built with new Date(isoDate + 'T12:00:00') to avoid UTC-midnight shift.
- OutlookDay type has no rainChance field — buildOutlookDays() omits it.
- Icon keys: cloudLightning (not cloudLightningBold) for storms; waterdropBold for snow.

---

### Stage 4 Hotfix — Zod Null Crash (COMPLETE)

Bug: Open-Meteo returns null for daily.weathercode[15] (16th forecast day is beyond reliable range). Zod schema declared it z.number() so every API call threw a ZodError, the store caught it, and the error banner appeared permanently. Live weather never loaded.

Fix in src/services/weather/weatherTypes.ts:
- hourly.weathercode, hourly.temperature_2m, hourly.apparent_temperature changed to .nullable().transform()
- daily.weathercode, daily.temperature_2m_max, daily.temperature_2m_min changed to .nullable().transform()
- weathercode nulls fall back to 3 (Overcast); temperature/wind nulls fall back to 0
- The three already-nullable fields (precipitation_probability_max, uv_index_max, windspeed_10m_max) were already correct

Fix in src/services/weather/weatherService.ts:
- todayPrefix now uses local date (getFullYear/getMonth/getDate) instead of new Date().toISOString().slice(0,10) which returns UTC date — wrong in UTC+ timezones near midnight

---

---

### Stage 5 — Local Persistence (COMPLETE)

Goal: make the app local-first. All key state survives a full app restart. No backend, no cloud sync — device-only storage via expo-sqlite.

#### New files

| File | Purpose |
|---|---|
| `src/lib/storage/storageKeys.ts` | Central constants: `STORAGE_KEYS.PREFERENCES`, `.APPEARANCE`, `.PLACES`, `.WEATHER`, `.weatherCache(id)` |
| `src/lib/storage/sqliteStorage.ts` | AsyncStorage-compatible adapter backed by expo-sqlite. Lazy-init `stratus.db` with a `kv (key TEXT PRIMARY KEY, value TEXT)` table. Exposes `getItem / setItem / removeItem` as Promises. All ops wrapped in try/catch (non-fatal). |
| `src/lib/storage/localStorage.ts` | Re-exports `getItem/setItem/removeItem` from sqliteStorage. Adds `clearStratusStorage()` (deletes all `stratus:%` keys). |
| `src/utils/temperature.ts` | `TemperatureUnit`, `celsiusToFahrenheit()`, `formatTemperature(celsius, unit)` → `"12°"` or `"54°"`, `formatTemperatureValue()`, `formatTemperatureRange()`. |
| `src/features/weather/weatherCache.ts` | Direct SQLite reads/writes keyed `stratus:cache:{locationId}`. Stores `{ payload, cachedAt }`. `loadWeatherCache()` returns null if > 2 hours old. `isWeatherCacheStale()` is async. `STALE_MESSAGE` constant. |
| `src/features/preferences/preferencesStore.ts` | Zustand persist store. State: `temperatureUnit`, `weatherTone`, `hapticsEnabled`, `useCurrentLocation`, `_hasHydrated`. Defaults: celsius, playful, haptics on, useLocation on. |
| `src/features/places/placesStore.ts` | Zustand persist store. State: `savedPlaces: CityResult[]`, `_hasHydrated`. Actions: `addPlace` (duplicate check by id or lat/lon < 0.01), `removePlace`, `isSaved`, `clearPlaces`. On first run (empty after rehydration): populates 5 defaults (Newcastle, London, Manchester, Lagos, Paris). |

#### Updated files

| File | Change |
|---|---|
| `src/features/appearance/appearanceStore.ts` | Wrapped with `persist` middleware. Added `_hasHydrated` flag + `onRehydrateStorage` callback. |
| `src/features/weather/weatherStore.ts` | Added `selectedLocation: CityResult \| null` (persisted). Added `_hasHydrated`. `partialize` persists only `selectedLocation` + `recentSearches` — not the full payload. Added `loadCachedWeather(id)` and `setSelectedLocation()` actions. `fetchWeatherForCity` and `fetchWeatherForCurrentLocation` now save cache + set `selectedLocation` on success. |
| `app/_layout.tsx` | New `AppBootstrap` wrapper subscribes to `_hasHydrated` on all 4 stores. Once all true: loads cached weather → triggers background fetch. `startedRef` prevents double startup. Shows blank view (< 50 ms, imperceptible) until hydrated. |
| `app/(tabs)/settings.tsx` | Wired to `usePreferencesStore`: °C/°F pill toggle, Playful/Simple tone pills, Haptics `Switch`, Use Current Location `Switch`. |
| `app/(tabs)/places.tsx` | `savedPlaces` from `usePlacesStore`. Each card has red trash button calling `removePlace(id)`. Empty state shows a "No saved places yet" view. `handleSavedPlaceTap` calls `setSelectedLocation` before fetching. |
| `app/search-city.tsx` | `handleAddCity` calls `addPlace + setSelectedLocation + fetchWeatherForCity` then navigates to `/(tabs)/today`. Search result shows check icon + lighter bg if already saved. |
| `app/(tabs)/today.tsx` | Removed self-fetch on mount (startup handled by `_layout.tsx`). Added `RefreshControl`. Added stale cache banner (below error banner). `formatTemperature` applied to main temp + hourly cards. `isWeatherCacheStale` checked on location/payload change. |
| `app/(tabs)/forecast.tsx` | `unit` from `usePreferencesStore`. `formatTemperature` on 7-day highs/lows and 16-day outlook highs/lows. |
| `app/weather-detail.tsx` | `unit` from `usePreferencesStore`. `formatTemperature` on hero highTemp/lowTemp, feelsLike metric card, hourly timeline temps, readiness summary string. |
| `app/(tabs)/globe.tsx` | `unit` from `usePreferencesStore`. `formatTemperature` on globe tooltip and selected location card temp. |

#### Architecture notes

- **No AsyncStorage**: SQLite adapter mimics the interface; `createJSONStorage(() => sqliteStorage)` works with Zustand's persist middleware unchanged.
- **Weather cache vs Zustand**: full `WeatherPayload` stored directly in SQLite (bypasses Zustand persist) to avoid slow hydration. Zustand only persists lightweight state (`selectedLocation`, `recentSearches`).
- **Hydration ordering**: each store's `onRehydrateStorage` sets `_hasHydrated = true`. `_layout.tsx` waits for all four before startup sequence.
- **Default places**: checked in `onRehydrateStorage` — only populated if `savedPlaces.length === 0`, so returning users who cleared all places get defaults again (intentional).
- **`temp` in globe.tsx / weather.temperature in today.tsx**: both are `number` from the store; `formatTemperature` expects `number`. The mock fallback value for `temp` is also a number literal.

---

---

### Stage 6 — App Appearance and Personalisation (COMPLETE)

Goal: allow users to personalise Stratus with theme packs, accent colours, background modes (theme / weather / time / custom image), overlay strength, and a blur toggle. All persisted locally.

#### New files

| File | Purpose |
|---|---|
| `src/features/appearance/appearanceTypes.ts` | `AccentColourId` type, `AccentPreset`, `ACCENT_PRESETS` (6 colour presets), `BackgroundResult` union type |
| `src/features/appearance/appearanceUtils.ts` | `getResolvedAccentHex(id)`, `applyAccentOverride(theme, id)` — patches primary, ring, button primary; short-circuits when accent matches theme primary |
| `src/features/appearance/backgroundResolver.ts` | `getTimeOfDay(date)`, `getWeatherBackground(code, theme)`, `getTimeBackground(date, theme)`, `resolveAppBackground({theme, mode, code, uri})`. Dark themes (night-cloud, race-day) always use `theme.gradients.screen` |
| `src/features/appearance/customBackground.ts` | `pickCustomBackgroundImage()` (expo-image-picker), `copyBackgroundToAppStorage(uri)` (expo-file-system copy to documentDirectory), `deleteCustomBackground(uri)` |
| `src/components/ui/ScreenBackground.tsx` | Wrapper replacing `<SafeAreaView>` in tab screens. Reads store + weather code, delegates to `resolveAppBackground`, renders ImageBackground / LinearGradient / plain SafeAreaView accordingly |

#### Updated files

| File | Change |
|---|---|
| `src/features/appearance/appearanceStore.ts` | Added `accentColourId: AccentColourId` (default 'sky'), `blurEnabled: boolean` (default false), `setAccentColour`, `setBlurEnabled` actions; `partialize` and `resetAppearance` updated |
| `src/theme/ThemeProvider.tsx` | Now reads `accentColourId` from appearanceStore and calls `applyAccentOverride(baseTheme, accentColourId)` before providing theme to context |
| `app/(tabs)/today.tsx` | Replaced `<SafeAreaView>` with `<ScreenBackground>` |
| `app/(tabs)/forecast.tsx` | Replaced `<SafeAreaView>` with `<ScreenBackground>` |
| `app/(tabs)/globe.tsx` | Replaced `<SafeAreaView>` with `<ScreenBackground>` |
| `app/(tabs)/places.tsx` | Replaced `<SafeAreaView>` with `<ScreenBackground>` |
| `app/weather-detail.tsx` | Replaced `<SafeAreaView>` with `<ScreenBackground>` |
| `app/search-city.tsx` | Replaced `<SafeAreaView>` with `<ScreenBackground>` |
| `app/(tabs)/settings.tsx` | Replaced `<SafeAreaView>` with `<ScreenBackground>`; added App Appearance section: Theme Pack (3-button row), Accent Colour (6-dot grid), Background mode (4-pill selector), Custom image pick/remove/error, Overlay dim +/− control, Blur toggle, Reset Appearance (with Alert confirmation) |

#### Architecture notes

- **Accent override**: `ThemeProvider` applies `applyAccentOverride` before providing theme to context — all consumers see the patched primary automatically; short-circuit keeps it referentially stable when no change needed
- **Background resolution**: `ScreenBackground` reads backgroundMode + customBackgroundUri from appearanceStore and weatherCode from weatherStore; delegates to pure `resolveAppBackground`; dark themes always keep their screen gradient (no light weather gradients overriding dark aesthetics)
- **Custom image persistence**: picker URI is copied to `documentDirectory` (survives app restarts); the copied path is stored in appearanceStore; deleteCustomBackground uses idempotent delete
- **Blur toggle**: stored and toggled in UI; actual blur rendering deferred (expo-glass-effect integration is complex; marked optional in spec)

---

## What Is NOT Implemented (Future Stages)

- Push notifications — no expo-notifications wiring
- Auth / profile / payments / subscriptions — none, not planned
- Functional 3D globe — globe screen has a decorative image only, no WebGL or interactive rotation
- Blur background rendering — toggle exists in store + UI but visual blur not yet applied

---

## Mock Data Locations

| File | Exports |
|---|---|
| `src/data/mockWeather.ts` | currentWeather, hourlyForecast, sevenDayForecast, sixteenDayOutlook |
| `src/data/mockPlaces.ts` | mockPlaces array (includes one isCurrent: true entry) |

---

## Open-Meteo API Notes

- No API key required
- Forecast endpoint: https://api.open-meteo.com/v1/forecast
- Geocoding endpoint: https://geocoding-api.open-meteo.com/v1/search
- Field names use old-style snake_case: weathercode, windspeed_10m, relativehumidity_2m
- daily.weathercode and other daily fields can be null for days 14-15 — all Zod schemas handle this with .nullable().transform()
- precipitation_probability is NOT in the current block — read from hourly[currentHourIndex]
- UV index in current block may be absent at night — declared .optional().default(0)

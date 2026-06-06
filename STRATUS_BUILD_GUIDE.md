# Stratus Build Guide for Codex / Claude Code

## Purpose

This document is the single source of truth for building **Stratus**, a free, playful weather companion app built with Expo React Native.

Use this guide with Codex, Claude Code, or any AI coding assistant to prevent design drift, boilerplate contamination, and incomplete workflows.

The priority is **successful execution** and **pixel-accurate fidelity to the exported design**, not overbuilding.

---

## ⚠️ Current State — Read This First

**The project already exists.** It lives in the `Stratus/` directory and is already scaffolded on **Expo SDK 55** with Expo Router, the five-tab layout, the theme system, mock data, and a first pass at every screen and component.

**Do NOT run `create-expo-app`. Do NOT start a fresh project. Do NOT delete or re-scaffold `Stratus/`.** The "Fresh Expo Setup" and "First Prompt" sections later in this guide describe how the project was *originally* bootstrapped and are kept for historical/reference context only. They do not describe the current job.

**The current job is correcting design drift.** A previous pass built all the screens but they do **not** match the exported design — wrong background colour, wrong radii, emoji instead of real icons, wrong layouts, no Quicksand font. The immediate priority is bringing every screen to **pixel-perfect parity** with the exported design and the reference screenshots, using the measurable spec in the next section.

Treat the rest of this guide as the statement of *intent* (what Stratus is, what it must never become, how it should feel and behave). Treat the **Design Fidelity Spec** below as the *contract* for how close the build must be.

Inputs you have:
- `Stratus/` — the existing Expo codebase to correct (SDK 55).
- `export-react/` — the canonical design source (React + Tailwind), including `globals.css`, one `.tsx` per screen, the Solar SVG icon set in `export-react/icons/`, and the 3D mascot PNGs in `export-react/images/`.
- 10 reference screenshots (964×1908 px each), one per screen.

---

## Design Fidelity Spec (the contract)

This section replaces all vague "match closely / don't freestyle" language elsewhere in the guide. Fidelity is **measured**, not eyeballed. The canonical design is `export-react/` plus the screenshots; where this guide's prose and the export ever disagree, **the export wins**.

### Working method — mandatory, every screen

1. Open the screen's source in `export-react/<screen>.tsx` and its reference screenshot. Translate the layout 1:1 — same element order, same structure, same grouping.
2. Convert every Tailwind class to its exact pixel value using the table below. Read the className, look up the number, use the number. Do not approximate.
3. Render the Expo screen in the iOS simulator, screenshot it, and place it beside the reference.
4. List every visible difference (position, size, spacing, radius, colour, weight, icon, asset) and fix each one.
5. Repeat 3–4 until the two are indistinguishable.
6. Report, per screen, that the comparison was done and what the final differences were.

Match the **content layout and the pixel values from the Tailwind classes**, not the raw 964 px screenshot width — the screenshots are shown inside a device frame, so real device width (e.g. 393 px on iPhone) is what the layout must adapt to. The Tailwind values are the source of truth, not the screenshot's pixel dimensions.

### Colour tokens (from `export-react/globals.css`)

Replace the current `soft-sky` theme values in `src/theme/themes.ts` with these exactly. Do not keep guessed values.

- background `#FFFDF5` (warm cream — **not** a blue background)
- card `#FFFFFF`
- text / foreground `#2d3436`
- mutedForeground `#636e72`
- primary `#38BDF8`
- secondary `#FBBF24`
- accent `#F472B6` (pink)
- destructive / danger `#ff6b6b`
- border `#E5E7EB`
- muted `#f0e6d6`
- Welcome screen background is a vertical gradient `#FFFDF5 → #E0F2FE`.

Alpha variants appear everywhere (`primary/10`, `primary/20`, `primary/5`, `border/50`, `muted-foreground/40`). Replicate with rgba at those opacities.

### Tailwind → pixel conversion

- Spacing/padding: `p-1.5`=6, `p-3`=12, `p-5`=20, `p-6`=24, `py-1.5`=6, `py-2`=8, `py-2.5`=10, `py-4`=16, `py-5`=20, `px-4`=16, `px-5`=20, `px-6`=24, `pt-12`=48, `pb-4`=16, `pb-6`=24, `pb-32`=128, `mb-3`=12, `mb-4`=16, `mb-6`=24, `mb-10`=40, `mt-8`=32, `gap-2`=8, `gap-3`=12, `gap-4`=16, `gap-6`=24, `space-y-4`=16, `space-y-6`=24, `space-y-8`=32.
- Radii: `rounded-xl`=12, `rounded-2xl`=16, `rounded-3xl`=24, `rounded-[1.5rem]`=24, `rounded-[2rem]`=32, `rounded-[2.5rem]`=40, `rounded-t-[3rem]`=48 (top corners), `rounded-full`=999.
- Fixed sizes: `w-10 h-10`=40, `w-11 h-11`=44, `w-12 h-12`=48, `w-16 h-16`=64, `w-48 h-48`=192 (Today mascot), `w-64 h-64`=256 (no-location mascot), `w-80 h-80`=320 (welcome mascot), `w-4.5 h-4.5`=18, `w-6.5`=26.
- Font sizes: `text-[9px]`=9, `text-[10px]`=10, `text-[11px]`=11, `text-xs`=12, `text-sm`=14, `text-base`=16, `text-lg`=18, `text-xl`=20, `text-2xl`=24, `text-3xl`=30, `text-4xl`=36, `text-5xl`=48, `text-8xl`=96 (Today's "12"), degree `°` at `text-4xl`=36.
- Weights: `font-medium`=500, `font-bold`=700, `font-black`=900. **Most text in this design is `font-black` (900)** — labels, numbers, nav text, buttons.
- Tracking: `tracking-wider` / `tracking-widest` on all uppercase labels → positive letterSpacing (~1–1.5 px).

### Typography

Load **Quicksand** via `expo-font` (weights 400/500/700; both `font-sans` and `font-heading` are Quicksand). Wire `AppText` so variants render the correct weights. **Verify Quicksand is actually rendering and not silently falling back to the system font before doing any per-screen work** — if the font is wrong, every measurement is wrong and nothing will line up. The Today temperature is 96px `font-black` with a superscript 36px degree symbol baseline-aligned as in the source (`items-start`, degree pushed down).

### Icons & images — no emoji, ever

All icons are real **Solar SVGs** in `export-react/icons/` (e.g. `solar-clouds-bold`, `solar-sun-bold`, `solar-cloud-sun-bold`, `solar-cloud-rain-bold`, `solar-t-shirt-bold`, `solar-umbrella-bold`, `solar-walking-bold`, `solar-map-point-bold`, `solar-map-point-wave-bold`, `solar-bell-bing-bold-duotone`, `solar-home-smile-bold`, `solar-calendar-minimalistic-bold`, `solar-earth-bold`, `solar-settings-minimalistic-bold`, `solar-gps-bold`, `solar-magnifer-linear`, `material-symbols-add-rounded`, `boxicons-cloud-lightning`). Bundle them and render via `react-native-svg` at the exact sizes in each source (16/18/24/28/32) and the exact colour from each `<Icon>`'s className (clouds=primary, sun=secondary, walking=accent pink, umbrella=mutedForeground, etc.).

The 3D mascot PNGs are in `export-react/images/`; bundle and render via `expo-image` at the exact `w-_ h-_` sizes with `object-contain`. **Replace every emoji `icon` field in the mock data** (e.g. `icon: '☁️'`) with references to the real SVG/PNG assets.

### Per-screen layout specifics

Compare each against its screenshot; these are the points most likely to drift.

- **Today:** header `pt-12 px-6` — "Good morning" (`text-sm font-bold` muted) with a white location pill below (map-point icon primary + city `font-black text-sm`, `rounded-full border px-4 py-1.5 shadow-sm`), and a 48px white circular bell button (`solar-bell-bing-bold-duotone`, primary) on the right. Centered: mascot (192px) → `12°` (96px) → `Cloudy` (24px muted, `-mt-3`) → mood pill (`primary/10` bg, primary text, `primary/20` border, `rounded-full px-5 py-2`). Comfort Score + Essentials = 2-col grid of white `rounded-[2.5rem] p-6` cards. "Should I?" = ONE white card containing a 3-col grid of `#FFFDF5` `rounded-3xl p-3` tiles (not a horizontal scroller). Quest = gradient card `secondary/10 → primary/10`, `rounded-[2.5rem] p-6`. Hourly = horizontal row of 80px-min white `rounded-[2rem] p-5` cards.
- **Forecast:** title `text-3xl` + subtitle; list of white `rounded-[2.5rem] p-6` cards, `space-y-4` between. The selected day (Thursday) has a pink (`accent`) border. Each card: day name `text-lg`, date muted, a colour label pill (`primary/10` + primary text), weather icon, high `text-xl` + low muted, "% rain" caption.
- **Globe:** title + subtitle; search row (white `rounded-full` input with magnifier + 48px gps button); globe card; "DRAG TO ROTATE · PINCH TO ZOOM" caption (uppercase, tracked, muted); bottom selected-location card with temp `text-3xl` + primary "View Forecast" pill.
- **Places:** title `text-3xl`; search input `rounded-[1.5rem]`; current-location card highlighted (`primary/10` bg, `primary/20` 2px border, `rounded-[2.5rem]`); other places white `rounded-[2.5rem] p-6`; dashed-border "add" card at bottom (`border-2 border-dashed`).
- **Settings:** uppercase tracked section headers; grouped white `rounded-[2.5rem]` cards with `divide-y` 1px dividers; rows `p-5` with 44px `rounded-2xl` tinted icon chips (primary/secondary/accent at /10), label `font-black`; °C/°F segmented control; "Playful" pill; reminder time text; blue toggle (`w-12 h-6.5` track, `w-4.5 h-4.5` knob); chevron rows; privacy `primary/5` info card with `shadow-inner`; footer links row.
- **Weather Detail:** 48px circular back button + "Friday" title + "NEWCASTLE · MAY 28" caption; large white hero card with mascot, `18°/14°` (the /14° smaller and muted), pink condition label; 2×2 grid of metric cards, each tinted icon + label + value.
- **No Location:** centered 256px sad-cloud mascot, "No location yet" (36px black), muted subtitle, white pill search input (`border-2`, `pl-14`), full-width primary "Search city" button (`py-5 rounded-full text-xl`), uppercase footer note.
- **Search City:** 48px back button + focused search input (`border-2 border-primary/20`); "RECENT SEARCHES" chips with close icons; "SEARCH RESULTS" white `rounded-[2rem] p-5` cards with city/country, temp `text-xl`, weather icon, 40px primary "+" circle button.
- **Welcome:** vertical gradient bg; centered 320px hugging sun+cloud mascot with a blurred primary glow behind; "Cloudie" (48px black), "Weather with personality" (24px), description (18px muted), full-width primary "Use my location" button with gps icon, ghost "Search city instead" button, uppercase privacy footer.
- **Tab bar (all main screens):** white 90%-opacity bar, `rounded-t-[3rem]` (48px top), `border-t`, `px-4 py-4`; items `w-16 h-16` (64px) stacked icon+label; active item primary with a `primary/10` circle highlight scaled behind the icon; icons 28px Solar set; labels `text-[9px] font-black`. The existing tab bar renders no icons (`tabBarIcon: () => null`) — fix this. Note the Quest screen swaps the centre "Globe" slot for "Quest" (the Quest *content* still lives on Today; this is only the badge/quest detail view's nav state).

### Completion gate

A screen is **not done** until its Expo render, screenshotted and placed beside the reference, is **pixel-indistinguishable**. The overall fidelity task is done only when all 10 screens have passed this loop and the agent has reported, per screen, the final (zero) differences. Feature-completeness does not substitute for visual parity.

---

## Product Summary

**App name:** Stratus  
**Type:** Free playful weather companion  
**Platform:** Expo React Native (SDK 55, existing project)  
**Data source:** Open-Meteo API  
**Storage:** Local-first device storage  
**Auth:** No authentication  
**Payment:** No subscription, no RevenueCat, no paywall  

Stratus helps users understand what the weather feels like, prepare for the day, save places, and explore locations on a fun globe.

The app should feel:
- playful
- personal
- polished
- lightweight
- useful
- portfolio-ready

It should not feel like:
- a corporate dashboard
- a serious meteorology app
- a clone of Apple Weather
- a fashion/outfit app
- a subscription SaaS product

---

## Core Product Positioning

Stratus is not trying to win because it has better weather data than major weather apps.

It wins through:
1. playful weather mood language
2. personalisation and themes
3. weather-readiness cards
4. saved places
5. interactive globe
6. tiny quests and badges

Suggested positioning:

> Stratus is a playful weather companion that helps you understand what today feels like and prepare for it in your own style.

---

## Non-Negotiable Rules

The app must follow these rules:

- The project already exists at `Stratus/` (SDK 55). Do not re-scaffold or start fresh.
- Do not inherit or reintroduce boilerplate/template design styles.
- Do not add authentication.
- Do not add profile/account screens.
- Do not add subscriptions.
- Do not add RevenueCat.
- Do not add payment screens.
- Do not use NativeWind unless explicitly requested later.
- Use React Native `StyleSheet` with a controlled token-based theme system.
- Use Expo Router.
- Use exactly five bottom tabs:
  1. Today
  2. Forecast
  3. Globe
  4. Places
  5. Settings
- There must be no separate Quest tab.
- Weather Quest should be a card inside the Today screen.
- Preferences, saved places, badges, and appearance settings should be stored locally.
- The UI must match the exported design screens per the Design Fidelity Spec above — measured, not approximate.
- Do not freestyle the design.
- Do not use generic template styling.
- Do not create duplicate workflows or dead-end screens.

---

## Reference: How the Project Was Originally Bootstrapped

> The following sections (through "First Prompt to Use") document the original greenfield setup. The project is already past this stage. Keep these for context; **do not execute them on the existing codebase.**

### Why Fresh Expo Install (historical)

A fresh project was originally used because previous projects failed when AI coding tools inherited unwanted boilerplate styles and layouts.

A clean project gives better control over navigation, spacing, theme tokens, component design, file structure, dependencies, and screen behaviour.

Original install (reference only — already done):

```bash
npx create-expo-app@latest stratus-weather --template default@sdk-56
cd stratus-weather
```

Note: the live project is on **SDK 55**, not 56. Follow the existing project's SDK; do not "upgrade" it as part of the fidelity work.

### Recommended Dependencies (reference)

These are already installed in `Stratus/package.json`. Verify before adding anything new; do not duplicate.

Base navigation and Expo support:

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens
```

Weather, device, storage, and UX:

```bash
npx expo install expo-location expo-notifications expo-haptics
npx expo install expo-sqlite expo-secure-store
npx expo install expo-image expo-image-picker expo-file-system expo-asset
```

Globe:

```bash
npx expo install expo-gl
npm install three expo-three
```

State and validation:

```bash
npm install zustand zod
```

For the fidelity work you will also need an SVG renderer if not already present:

```bash
npx expo install react-native-svg
```

Do not install large UI libraries unless explicitly approved.

---

## Target Folder Structure

This matches the existing project. Use it to locate files, not to recreate them.

```txt
app/
  _layout.tsx
  index.tsx
  (tabs)/
    _layout.tsx
    today.tsx
    forecast.tsx
    globe.tsx
    places.tsx
    settings.tsx
  weather-detail.tsx
  search-city.tsx
  no-location.tsx

src/
  components/
    ui/
    weather/
    globe/
    settings/
  data/
  features/
    weather/
    places/
    appearance/
    badges/
    notifications/
  lib/
  services/
    weather/
  theme/
  types/
  utils/

assets/
  images/
  icons/
  textures/
```

---

## Navigation Structure

Bottom tabs:

```txt
Today | Forecast | Globe | Places | Settings
```

Supporting screens:
- Weather Detail
- Search City
- No Location / Permission Denied

Workflow:

```txt
Welcome / Permission
  ├── Use current location → Today
  └── Search city instead → Search City → Today

Today
  ├── Weather Detail
  ├── Mark Weather Quest Done
  └── Hourly forecast

Forecast
  └── Weather Detail

Globe
  ├── Select saved city pin
  └── View Forecast / Weather Detail

Places
  ├── Search City
  ├── Add City
  ├── Remove City
  └── Open Weather Detail

Settings
  ├── App Appearance
  ├── Manage saved places
  ├── Privacy Policy
  ├── Terms of Use
  └── Send Feedback
```

---

## Screens Required

> For the visual contract of each screen, see the **Per-screen layout specifics** in the Design Fidelity Spec. The sections below define *content and purpose*; the spec defines *exact appearance*.

### 1. Welcome / Location Permission

Purpose:
- Introduce Stratus
- Ask for location permission
- Offer city search alternative

Content:
- App name: Stratus
- Headline: Weather with personality
- Subtext: Check the forecast, understand what today feels like, and get tiny weather tips for your day.
- Primary CTA: Use my location
- Secondary CTA: Search city instead
- Privacy note: Location is only used to show your local weather.

No login. No multi-step onboarding.

---

### 2. Today

Purpose:
Main home screen.

Must include:
- greeting
- current location
- large temperature
- weather condition
- weather mood
- cute weather mascot / illustration
- comfort score
- today’s essentials
- “Should I?” cards
- Today’s Weather Quest card
- hourly forecast

Weather Quest belongs here, not in a tab.

Universal readiness language only:
- light layer
- warm layer
- waterproof layer
- umbrella
- sunscreen
- comfortable shoes
- wind-resistant layer
- water bottle

Do not use gendered outfit suggestions.

---

### 3. Forecast

Purpose:
Weekly forecast and longer outlook.

Must include:
- 7-day forecast as primary
- each day with icon, high/low, rain chance, playful label
- compact 16-day outlook as secondary
- tap day to open Weather Detail

Long-range copy:
> Longer range forecasts can change, but they’re useful for planning.

---

### 4. Globe

Purpose:
Portfolio wow feature.

Must include:
- playful 3D-style globe
- saved city pins
- current location pin
- selected city tooltip
- zoom controls
- hint: Drag to rotate · Pinch to zoom
- selected city weather card
- city chips as selection fallback

Important:
- The functional implementation should use `expo-gl`, `three`, and `expo-three`.
- Do not use expo-maps for this screen.
- This is not a flat map screen.
- Do not show roads, streets, or satellite map tiles.

V1 globe should support:
- rotate
- zoom
- saved city pins
- selected city card
- fallback city selection chips

Avoid:
- live radar
- heatmaps
- cloud layers
- particle systems
- global weather simulation

Note: `three` + `expo-gl` + `expo-three` are version-sensitive. Pin known-compatible versions, keep the scene minimal, and treat the globe as the highest-risk technical item — build it after the static fidelity work is locked so a globe problem cannot block the rest of the app.

---

### 5. Places

Purpose:
Manage saved cities.

Must include:
- current location card
- saved places list
- search city input/button
- add city
- remove city
- weather preview per city
- saved places are used by the Globe screen

This screen directly supports the Globe tab.

---

### 6. Weather Detail

Purpose:
Detailed day/city weather.

Must include:
- city
- date/day
- high/low
- weather mood
- mascot
- feels like
- rain probability
- wind
- humidity
- UV index
- sunrise/sunset placeholder
- hourly timeline
- weather-ready summary

---

### 7. Settings

Purpose:
Preferences and support.

Must include:
- temperature unit
- weather tone: playful/simple
- daily reminder time
- haptics toggle
- use current location toggle
- manage saved places
- app appearance entry
- privacy note
- send feedback
- privacy policy
- terms of use
- about Stratus

No account/profile section.

---

### 8. No Location State

Purpose:
Handle denied location permission.

Must include:
- friendly illustration
- “No location yet”
- city search alternative
- option to enable location later

---

### 9. Search City

Purpose:
Find and add cities using Open-Meteo geocoding.

Must include:
- search input
- results list
- add city action
- recent searches
- confirmation when added

---

## Personalisation / Theme Pack System

Stratus should support full design personalisation later.

This is a key differentiator.

Do not treat themes as only colour changes.

A theme pack should control:
- colours
- gradients
- card styling
- button styling
- tab styling
- icon/mascot style
- copy tone
- background style
- border radius
- shadow style

Initial theme packs:
1. Soft Sky
2. Night Cloud
3. Race Day

> When correcting drift, only the **Soft Sky** theme must reach pixel parity (it is the one in the screenshots). Keep `night-cloud` and `race-day` intact and functional; do not break them, but they are not the fidelity target.

### Soft Sky

Default cute weather theme. The authoritative values are in the Design Fidelity Spec (background `#FFFDF5`, primary `#38BDF8`, secondary `#FBBF24`, accent `#F472B6`, 40px card radius, Quicksand black weights). The mood — soft blue, cream, yellow, mint, rounded large cards, playful sky feeling — must be realised through those exact tokens, not approximated from the mood words.

### Night Cloud

Dark cozy theme:
- navy
- purple
- muted lavender
- soft glow
- calmer copy

### Race Day

F1-inspired fun theme:
- black
- red
- white
- racing/pit-stop language
- sharper cards
- faster visual energy

Race Day copy examples:
- Comfort Score → Track Comfort
- Today’s Essentials → Pit Stop Essentials
- Weather Quest → Race Day Challenge
- Weather Mood → Race Conditions
- Rain warning → Wet Tyre Alert
- Wind warning → Aero Alert

Important:
Do not create separate screens per theme.

Correct:
```txt
TodayScreen.tsx uses theme tokens
```

Incorrect:
```txt
TodayScreenSoft.tsx
TodayScreenF1.tsx
TodayScreenNight.tsx
```

---

## Background Customisation

Users should later be able to personalise the app with background images and themes.

Feature requirements:
- choose preset theme
- choose accent colour
- use weather-based background
- use time-of-day background
- use custom background image
- adjust background dim/overlay
- reset appearance

Implementation direction:
- `expo-image-picker` for image selection
- `expo-file-system` to copy selected image into persistent app storage
- local storage for selected theme/background mode
- always apply readable overlay on custom backgrounds

This should live under:

```txt
Settings → App Appearance
```

---

## Weather Data

Use Open-Meteo.

Expo provides location but not weather data.

Flow:

```txt
expo-location → latitude/longitude → Open-Meteo forecast API → Stratus UI
```

Open-Meteo should provide:
- current weather
- hourly forecast
- daily forecast
- 7-day forecast
- 16-day outlook
- geocoding city search

Use forecast days:
- 7 days as primary
- up to 16 days as outlook

---

## Weather Interpretation Engine

This is one of the most important product features.

The API gives raw data.
Stratus turns it into personality and guidance.

The engine should generate:
- weather mood
- comfort score
- essentials
- “Should I?” answers
- daily quest
- badge triggers
- friendly notification copy

Example outputs:
- Soft cloudy morning
- Hoodie mode
- Umbrella quest activated
- Wind is being dramatic
- Sunny little win
- Rainy reset day
- Best walk window: 4 PM – 6 PM

Use rule-based logic first.
No AI required.

---

## Badges

Badges are light fun, not the main product.

Possible badges:
- First Weather Check
- Rain Ready
- Hoodie Mode
- Wind Warrior
- Golden Hour
- Storm Watcher
- Globe Explorer
- 7-Day Streak

Badge state:
- unlocked = colourful
- locked = faded

Badges can appear in Today or Settings/About.
No separate badge tab for v1.

---

## Notifications

Use local notifications first.

Examples:
- Umbrella might save you after 3 PM.
- It’s sunny now. Good time for a quick walk.
- Wind is getting dramatic later.
- Temperature is dropping soon. Layer up.
- Golden hour is looking good today.

Avoid:
- backend push notifications
- severe weather emergency claims
- alarmist messaging

---

## Design Guardrails

The UI must match the exported screens per the Design Fidelity Spec (measured parity, export wins on any conflict).

Core style:
- soft gradients
- pastel colours
- rounded cards
- cute weather icons (real Solar SVGs, never emoji)
- playful mascot illustrations (real PNGs from `export-react/images/`)
- large readable temperature
- pill chips
- soft shadows
- friendly typography (Quicksand)
- app-store quality polish

Avoid:
- corporate dashboard look
- Bootstrap-like UI
- Tailwind web layout copied structurally where it fights native layout (translate intent, hit the same pixels)
- square harsh cards
- dense charts
- tiny typography
- random dark theme
- generic template styling
- emoji standing in for icons

---

## Component System

Reusable themed components (these already exist in the project — correct them, don't recreate):

```txt
AppScreen
AppCard
AppButton
AppText
AppPill
WeatherHeroCard
WeatherMoodPill
ComfortScoreCard
EssentialsCard
ShouldICard
WeatherQuestCard
ForecastDayCard
OutlookDayCard
SavedPlaceCard
SelectedLocationCard
WeatherDetailGrid
BottomTabBar
EmptyState
BadgeCard
```

All components must use theme tokens.

Do not hardcode colours inside screens.

---

## Build Stages

> Stages 1–2 are already complete in the existing project. The current entry point is **Stage 3 (Design Fidelity)**, which is now the gated priority. Later stages assume the fidelity gate has passed.

### Stage 1: Fresh Expo Setup — ✅ DONE (reference only)

Originally: create project, install dependencies, folder structure, placeholder routes, five tabs. Do not re-run.

### Stage 2: Theme System — ✅ DONE, needs correction

The token-based provider and three themes exist. The `soft-sky` token *values* are wrong and are corrected as part of Stage 3 using the Design Fidelity Spec.

Test:
- theme can switch globally
- no hardcoded screen colours
- `soft-sky` tokens match `globals.css` exactly

---

### Stage 3: Design Fidelity (PRIORITY) 

Goal:
- Load and verify Quicksand.
- Correct the `soft-sky` theme tokens to the exact values in the spec.
- Bundle the Solar SVG icons and mascot PNGs; remove all emoji icon fields.
- Bring Today, Forecast, Globe (static frame), Places, Settings, Weather Detail, Search City, No Location, and Welcome to pixel parity using the mandatory render-and-compare loop.
- Fix the tab bar (it currently shows no icons).

Test (the completion gate):
- Quicksand confirmed rendering (not a system fallback).
- Every screen passed the side-by-side loop and is pixel-indistinguishable from its reference.
- Per-screen report of final differences delivered (should be none).
- No design drift, no missing workflows, no emoji icons.

Do not proceed to Stage 4 until this gate passes.

---

### Stage 4: Weather Service

Goal:
- add Open-Meteo API service
- support current weather, hourly, daily, 16-day outlook, geocoding
- map weather codes to app condition labels

Test:
- London/Newcastle/Lagos city search works
- weather data appears in UI
- loading/error states work

---

### Stage 5: Local Storage

Goal:
- save places
- save preferences
- save selected theme
- save background mode
- save badges/streaks

Test:
- close/reopen app and data persists

---

### Stage 6: Personalisation

Goal:
- App Appearance screen
- theme switcher
- accent presets
- custom background image
- overlay/dim control

Test:
- selected appearance applies globally
- custom image persists
- text remains readable

---

### Stage 7: Globe

Goal:
- add functional 3D globe
- rotate/zoom
- saved city pins
- selected city card
- fallback chips

Test:
- globe does not crash app
- pins display for saved places
- selected card updates

---

### Stage 8: Notifications and Badges

Goal:
- local reminders
- quest completion
- badge unlocks
- streak calculation

Test:
- notifications scheduled locally
- badge state persists
- quest is not a tab

---

### Stage 9: Polish

Goal:
- loading states
- empty states
- error states
- accessibility labels
- spacing consistency
- performance cleanup
- app icon/splash placeholder
- re-run the fidelity loop on any screen touched since Stage 3

Test:
- no dead ends
- no duplicate screens
- no broken routes
- no auth/paywall accidentally added
- fidelity gate still passes

---

### Stage 10: Production

Goal:
- configure app.json/app.config
- build with EAS
- prepare store assets
- privacy policy and terms
- submit when ready

---

## First Prompt to Use — ⚠️ HISTORICAL, DO NOT RUN

> This prompt was used to bootstrap the original project. It is preserved for reference. **Running it now would re-scaffold over the existing work.** For the current job, use the "Prompt to Use Now" below instead.

```txt
We are starting a fresh Expo React Native app called Stratus.
[... original scaffolding prompt; superseded ...]
```

---

## Prompt to Use Now (drift correction)

```txt
The Stratus Expo project already exists at ./Stratus (Expo SDK 55). Do NOT
re-scaffold it. The canonical design is in ./export-react (React + Tailwind,
with globals.css, one .tsx per screen, Solar SVG icons in export-react/icons,
and mascot PNGs in export-react/images) plus the 10 reference screenshots.

The build drifted from the design. Your job is pixel-perfect parity, screen by
screen, following the Design Fidelity Spec in STRATUS_BUILD_GUIDE.md.

Start with foundations, in this order:
1. Read the versioned Expo SDK 55/56 docs (per AGENTS.md) before writing code.
2. Load Quicksand via expo-font and VERIFY it renders (not a system fallback).
3. Correct the soft-sky theme tokens in src/theme/themes.ts to the exact values
   in the spec (background #FFFDF5, primary #38BDF8, secondary #FBBF24,
   accent #F472B6, border #E5E7EB, card radius 40px, etc.).
4. Bundle the Solar SVGs (render via react-native-svg) and mascot PNGs (via
   expo-image); remove every emoji icon field from the mock data.

Then, for EACH screen (Today, Forecast, Globe, Places, Settings, Weather Detail,
Search City, No Location, Welcome) and the tab bar:
  a. Translate export-react/<screen>.tsx 1:1, using the Tailwind→pixel table.
  b. Render in the iOS simulator, screenshot it, compare side-by-side with the
     reference screenshot.
  c. List every difference and fix it. Repeat until indistinguishable.
  d. Report what you compared and the final differences.

Do not touch weather data, storage, notifications, or the functional 3D globe
yet — only static fidelity. Keep night-cloud and race-day themes intact. A
screen is done only when its render is pixel-indistinguishable from the
reference. Work one screen at a time; show me each before moving on.
```

---

## Success Criteria

The project is successful when:

- Stratus runs from the existing `Stratus/` project (no accidental re-scaffold).
- It has exactly five tabs.
- **Every Soft Sky screen is pixel-indistinguishable from its reference screenshot** (the fidelity gate passed and was reported per screen).
- Quicksand is the rendered font; icons are real Solar SVGs; mascots are real PNGs; no emoji stand-ins.
- It does not inherit unrelated boilerplate design.
- It has no auth or paywall.
- It uses Open-Meteo for weather.
- Saved places persist locally.
- Personalisation works locally.
- The Globe screen works without crashing.
- The UI feels fun, polished, and portfolio-ready.

---

## Final Reminder for AI Coding Tools

Build in small stages.

Do not build the entire app in one prompt.

Do not start a fresh project — the codebase already exists.

After every stage (and every screen during the fidelity stage):
1. run the app
2. screenshot and compare against the reference
3. fix issues
4. only then move on

Fidelity is measured, not eyeballed. The export wins every conflict.

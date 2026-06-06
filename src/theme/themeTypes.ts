import type { TextStyle, ViewStyle } from 'react-native';

export type ThemeId = 'soft-sky' | 'night-cloud' | 'race-day';

export type CopyTone = 'playful' | 'cozy' | 'racing';

export type BackgroundMode = 'theme' | 'weather' | 'time' | 'custom';

export type ThemeGradient = readonly [string, string, ...string[]];

export type ThemeColorToken =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'mutedText'
  | 'text'
  | 'danger';

export type AppTheme = {
  id: ThemeId;
  name: string;
  copyTone: CopyTone;
  colors: {
    background: string;
    backgroundAlt: string;
    card: string;
    cardForeground: string;
    cardMuted: string;
    foreground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    text: string;
    muted: string;
    mutedText: string;
    border: string;
    input: string;
    ring: string;
    success: string;
    warning: string;
    danger: string;
    destructive: string;
    tabBar: string;
    tabActive: string;
    tabInactive: string;
    overlay: string;
    buttonText: string;
    heroAccent: string;
    cardOverlay: string;
    highlight: string;
    globeWater: string;
    globeLand: string;
    globePin: string;
    globePinSelected: string;
    chart1: string;
    chart2: string;
    chart3: string;
    chart4: string;
    chart5: string;
  };
  gradients: {
    screen: ThemeGradient;
    hero: ThemeGradient;
    card: ThemeGradient;
  };
  radii: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    roundedXl: number;
    rounded2xl: number;
    rounded3xl: number;
    rounded1_5rem: number;
    rounded2rem: number;
    rounded2_5rem: number;
    roundedTop3rem: number;
    full: number;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    p1_5: number;
    p3: number;
    p5: number;
    p6: number;
    px4: number;
    px5: number;
    px6: number;
    py1_5: number;
    py2: number;
    py2_5: number;
    py4: number;
    py5: number;
    pt12: number;
    pb32: number;
    gap2: number;
    gap3: number;
    gap4: number;
    gap6: number;
  };
  shadows: {
    card: ViewStyle;
    floating: ViewStyle;
  };
  typography: {
    titleSize: number;
    headingSize: number;
    bodySize: number;
    captionSize: number;
    temperatureSize: number;
    titleWeight: TextStyle['fontWeight'];
    bodyWeight: TextStyle['fontWeight'];
    temperatureWeight: TextStyle['fontWeight'];
  };
  buttons: {
    primary: {
      background: string;
      text: string;
      border: string;
    };
    secondary: {
      background: string;
      text: string;
      border: string;
    };
    ghost: {
      background: string;
      text: string;
      border: string;
    };
  };
  weatherMoodStyle: {
    sunny: string;
    cloudy: string;
    rainy: string;
    stormy: string;
    snowy: string;
  };
  backgroundStyle: {
    type: 'soft' | 'dark' | 'sport';
    texture: 'cloudy' | 'glow' | 'track';
  };
};

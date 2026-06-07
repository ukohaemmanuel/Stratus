export type AccentColourId = 'sky' | 'sun' | 'pink' | 'mint' | 'storm' | 'race';

export type AccentPreset = { id: AccentColourId; label: string; hex: string };

export const ACCENT_PRESETS: AccentPreset[] = [
  { id: 'sky',   label: 'Sky',   hex: '#38BDF8' },
  { id: 'sun',   label: 'Sun',   hex: '#FBBF24' },
  { id: 'pink',  label: 'Pink',  hex: '#F472B6' },
  { id: 'mint',  label: 'Mint',  hex: '#4ECDC4' },
  { id: 'storm', label: 'Storm', hex: '#6366F1' },
  { id: 'race',  label: 'Race',  hex: '#E10600' },
];

export type BackgroundResult =
  | { type: 'color'; color: string }
  | { type: 'gradient'; colors: [string, string, ...string[]] }
  | { type: 'image'; uri: string };

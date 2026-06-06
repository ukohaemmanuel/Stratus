import type { IconKey } from '../assets/icons';
import type { ThemeColorToken } from '@/theme';

export type MockBadge = {
  id: string;
  name: string;
  unlocked: boolean;
  icon: IconKey;
  iconColor: ThemeColorToken;
};

export const mockBadges: MockBadge[] = [
  { id: 'first-sunny-check', name: 'First Sunny Check', unlocked: true, icon: 'sun2Bold', iconColor: 'secondary' },
  { id: 'rain-ready', name: 'Rain Ready', unlocked: true, icon: 'umbrellaBold', iconColor: 'primary' },
  { id: 'hoodie-mode', name: 'Hoodie Mode', unlocked: true, icon: 'tShirtBold', iconColor: 'accent' },
  { id: 'wind-warrior', name: 'Wind Warrior', unlocked: false, icon: 'windBold', iconColor: 'mutedText' },
  { id: 'golden-hour', name: 'Golden Hour', unlocked: false, icon: 'sunFogBold', iconColor: 'mutedText' },
  { id: 'storm-watcher', name: 'Storm Watcher', unlocked: false, icon: 'cloudLightning', iconColor: 'mutedText' },
];

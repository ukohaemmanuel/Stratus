import type { PropsWithChildren } from 'react';
import {
  Pressable,
  StyleSheet,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useAppTheme } from '@/theme';

import { AppText } from './AppText';

type AppPillProps = PropsWithChildren<{
  onPress?: (event: GestureResponderEvent) => void;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
  textColor?: string;
}>;

export function AppPill({
  children,
  onPress,
  selected = false,
  style,
  textColor,
}: AppPillProps) {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        {
          backgroundColor: selected ? theme.colors.primary : theme.colors.cardMuted,
          borderColor: selected ? theme.colors.primary : theme.colors.border,
          borderRadius: theme.radii.full,
          minHeight: 36,
          opacity: pressed ? 0.82 : 1,
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.sm,
        },
        style,
      ]}
    >
      <AppText
        muted={!selected}
        style={[
          styles.label,
          {
            color: textColor ?? (selected ? theme.colors.buttonText : undefined),
          },
        ]}
        variant="caption"
      >
        {children}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  label: {
    textAlign: 'center',
  },
  pill: {
    alignItems: 'center',
    borderWidth: 1,
    justifyContent: 'center',
  },
});

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

type AppButtonVariant = 'primary' | 'secondary' | 'ghost';

type AppButtonProps = PropsWithChildren<{
  disabled?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  variant?: AppButtonVariant;
}>;

export function AppButton({
  children,
  disabled = false,
  onPress,
  style,
  variant = 'primary',
}: AppButtonProps) {
  const theme = useAppTheme();
  const button = theme.buttons[variant];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: button.background,
          borderColor: button.border,
          borderRadius: theme.radii.full,
          minHeight: 50,
          opacity: disabled ? 0.5 : pressed ? 0.82 : 1,
          paddingHorizontal: theme.spacing.xl,
          paddingVertical: theme.spacing.md,
        },
        style,
      ]}
    >
      <AppText style={[styles.label, { color: button.text }]} variant="body">
        {children}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderWidth: 1,
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
  },
});

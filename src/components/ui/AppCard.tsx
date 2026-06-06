import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useAppTheme } from '@/theme';

type AppCardVariant = 'default' | 'muted' | 'hero';

type AppCardProps = PropsWithChildren<{
  variant?: AppCardVariant;
  style?: StyleProp<ViewStyle>;
}>;

export function AppCard({ children, style, variant = 'default' }: AppCardProps) {
  const theme = useAppTheme();
  const backgroundColor =
    variant === 'muted'
      ? theme.colors.cardMuted
      : variant === 'hero'
        ? theme.colors.cardOverlay
        : theme.colors.card;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor,
          borderColor: theme.colors.border,
          borderRadius: variant === 'hero' ? theme.radii.xl : theme.radii.lg,
          padding: variant === 'hero' ? theme.spacing.xl : theme.spacing.lg,
        },
        variant === 'hero' ? theme.shadows.floating : theme.shadows.card,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    overflow: 'hidden',
  },
});

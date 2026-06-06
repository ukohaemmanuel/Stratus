import { Pressable, StyleSheet, type GestureResponderEvent } from 'react-native';

import { useAppTheme } from '@/theme';

import { AppText } from './AppText';

type IconButtonProps = {
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
  symbol: string;
};

export function IconButton({ label, onPress, symbol }: IconButtonProps) {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
          borderRadius: theme.radii.full,
          height: 48,
          opacity: pressed ? 0.82 : 1,
          width: 48,
        },
        theme.shadows.card,
      ]}
    >
      <AppText style={styles.symbol}>{symbol}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderWidth: 1,
    justifyContent: 'center',
  },
  symbol: {
    fontSize: 20,
  },
});

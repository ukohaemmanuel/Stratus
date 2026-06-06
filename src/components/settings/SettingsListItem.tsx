import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useAppTheme } from '@/theme';

type SettingsListItemProps = {
  meta?: string;
  onPress?: () => void;
  title: string;
};

export function SettingsListItem({ meta, onPress, title }: SettingsListItemProps) {
  const theme = useAppTheme();

  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      {({ pressed }) => (
        <View
          style={[
            styles.row,
            {
              borderBottomColor: theme.colors.border,
              minHeight: 50,
              opacity: pressed ? 0.72 : 1,
              paddingVertical: theme.spacing.md,
            },
          ]}
        >
          <AppText>{title}</AppText>
          {meta ? (
            <AppText muted style={styles.meta} variant="caption">
              {meta}
            </AppText>
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  meta: {
    textAlign: 'right',
  },
});

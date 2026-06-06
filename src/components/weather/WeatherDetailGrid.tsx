import { StyleSheet, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { useAppTheme } from '@/theme';

type WeatherDetailGridProps = {
  items: Array<{
    label: string;
    value: string;
  }>;
};

export function WeatherDetailGrid({ items }: WeatherDetailGridProps) {
  const theme = useAppTheme();

  return (
    <View style={[styles.grid, { gap: theme.spacing.md }]}>
      {items.map((item) => (
        <AppCard key={item.label} variant="muted" style={styles.cell}>
          <View style={[styles.cellContent, { gap: theme.spacing.xs }]}>
            <AppText muted variant="caption">
              {item.label}
            </AppText>
            <AppText variant="body">{item.value}</AppText>
          </View>
        </AppCard>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  cell: {
    flexBasis: '47%',
    flexGrow: 1,
  },
  cellContent: {},
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

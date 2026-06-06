import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import type { MockPlace } from '@/data/mockPlaces';
import { useAppTheme } from '@/theme';

type SelectedLocationCardProps = {
  onViewForecast?: () => void;
  place: MockPlace;
};

export function SelectedLocationCard({ onViewForecast, place }: SelectedLocationCardProps) {
  const theme = useAppTheme();

  return (
    <AppCard variant="hero">
      <View style={[styles.stack, { gap: theme.spacing.md }]}>
        <View style={styles.row}>
          <View>
            <AppText variant="heading">{place.city}</AppText>
            <AppText muted>{place.weatherMood}</AppText>
          </View>
          <AppText variant="temperature">{place.temperature}°</AppText>
        </View>
        <View style={[styles.meta, { gap: theme.spacing.sm }]}>
          <AppText muted variant="caption">
            {place.rainChance}% rain
          </AppText>
          <AppText muted variant="caption">
            {place.wind} wind
          </AppText>
          <AppText muted variant="caption">
            Saved
          </AppText>
        </View>
        <AppButton onPress={onViewForecast}>View Forecast</AppButton>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stack: {},
});

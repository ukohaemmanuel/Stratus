import { StyleSheet, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { useAppTheme } from '@/theme';

type HourlyForecastCardProps = {
  icon: string;
  rainChance: number;
  temperature: number;
  time: string;
};

export function HourlyForecastCard({
  icon,
  rainChance,
  temperature,
  time,
}: HourlyForecastCardProps) {
  const theme = useAppTheme();

  return (
    <AppCard variant="muted" style={[styles.card, { minWidth: 96 }]}>
      <View style={[styles.content, { gap: theme.spacing.sm }]}>
        <AppText muted variant="caption">
          {time}
        </AppText>
        <AppText style={styles.icon}>{icon}</AppText>
        <AppText variant="body">{temperature}°</AppText>
        <AppText muted variant="caption">
          {rainChance}% rain
        </AppText>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 30,
  },
});

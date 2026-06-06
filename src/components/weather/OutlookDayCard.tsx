import { StyleSheet, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { useAppTheme } from '@/theme';

type OutlookDayCardProps = {
  date: string;
  dayName: string;
  highTemp: number;
  icon: string;
  lowTemp: number;
};

export function OutlookDayCard({ date, dayName, highTemp, icon, lowTemp }: OutlookDayCardProps) {
  const theme = useAppTheme();

  return (
    <AppCard variant="muted" style={[styles.card, { minWidth: 96 }]}>
      <View style={[styles.content, { gap: theme.spacing.xs }]}>
        <AppText variant="body">{dayName}</AppText>
        <AppText muted variant="caption">
          {date}
        </AppText>
        <AppText style={styles.icon}>{icon}</AppText>
        <AppText variant="caption">
          {highTemp}° / {lowTemp}°
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
    fontSize: 24,
  },
});

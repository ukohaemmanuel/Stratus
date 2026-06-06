import { Pressable, StyleSheet, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { useAppTheme } from '@/theme';

type ForecastDayCardProps = {
  date: string;
  dayName: string;
  highTemp: number;
  icon: string;
  label: string;
  lowTemp: number;
  onPress?: () => void;
  rainChance: number;
};

export function ForecastDayCard({
  date,
  dayName,
  highTemp,
  icon,
  label,
  lowTemp,
  onPress,
  rainChance,
}: ForecastDayCardProps) {
  const theme = useAppTheme();

  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      {({ pressed }) => (
        <AppCard style={{ opacity: pressed ? 0.82 : 1 }}>
          <View style={[styles.row, { gap: theme.spacing.md }]}>
            <View style={styles.day}>
              <AppText variant="body">{dayName}</AppText>
              <AppText muted variant="caption">
                {date}
              </AppText>
            </View>
            <View
              style={[
                styles.iconBubble,
                {
                  backgroundColor: theme.colors.cardMuted,
                  borderRadius: theme.radii.full,
                },
              ]}
            >
              <AppText style={styles.icon}>{icon}</AppText>
            </View>
            <View style={styles.details}>
              <AppText variant="body">{label}</AppText>
              <AppText muted variant="caption">
                {rainChance}% rain
              </AppText>
            </View>
            <AppText variant="body">
              {highTemp}° / {lowTemp}°
            </AppText>
          </View>
        </AppCard>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  day: {
    minWidth: 78,
  },
  details: {
    flex: 1,
  },
  icon: {
    fontSize: 26,
  },
  iconBubble: {
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});

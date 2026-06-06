import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { useAppTheme } from '@/theme';

type WeatherQuestCardProps = {
  bestTime: string;
  quest: string;
  reward: string;
  title: string;
};

export function WeatherQuestCard({ bestTime, quest, reward, title }: WeatherQuestCardProps) {
  const theme = useAppTheme();

  return (
    <AppCard variant="hero">
      <View style={[styles.row, { gap: theme.spacing.lg }]}>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: theme.colors.heroAccent,
              borderRadius: theme.radii.full,
            },
          ]}
        >
          <AppText style={styles.badgeIcon}>★</AppText>
        </View>
        <View style={[styles.stack, { gap: theme.spacing.md }]}>
          <AppText muted variant="caption">
            {title}
          </AppText>
          <AppText variant="heading">{quest}</AppText>
          <View style={[styles.metaRow, { gap: theme.spacing.sm }]}>
            <AppText muted variant="caption">
              Best time: {bestTime}
            </AppText>
            <AppText muted variant="caption">
              Reward: {reward}
            </AppText>
          </View>
          <AppButton>Mark done</AppButton>
        </View>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  badgeIcon: {
    fontSize: 28,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  stack: {
    flex: 1,
  },
});

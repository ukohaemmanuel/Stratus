import { StyleSheet, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { useAppTheme } from '@/theme';

type ComfortScoreCardProps = {
  description: string;
  score: number;
  title?: string;
};

export function ComfortScoreCard({
  description,
  score,
  title = 'Comfort Score',
}: ComfortScoreCardProps) {
  const theme = useAppTheme();

  return (
    <AppCard>
      <View style={[styles.content, { gap: theme.spacing.lg }]}>
        <View style={styles.copy}>
          <AppText variant="heading">{title}</AppText>
          <AppText muted>{description}</AppText>
        </View>
        <View
          style={[
            styles.scoreBubble,
            {
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.heroAccent,
              borderRadius: theme.radii.full,
            },
          ]}
        >
          <AppText style={{ color: theme.colors.buttonText }} variant="heading">
            {score}
          </AppText>
        </View>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  copy: {
    flex: 1,
  },
  scoreBubble: {
    alignItems: 'center',
    borderWidth: 4,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
});

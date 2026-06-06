import { StyleSheet, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { useAppTheme } from '@/theme';

type ShouldICardProps = {
  answer: string;
  question: string;
};

export function ShouldICard({ answer, question }: ShouldICardProps) {
  const theme = useAppTheme();

  return (
    <AppCard
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.highlight,
          minWidth: 178,
        },
      ]}
    >
      <View style={[styles.stack, { gap: theme.spacing.sm }]}>
        <AppText style={styles.spark}>?</AppText>
        <AppText variant="body">{question}</AppText>
        <AppText muted variant="caption">
          {answer}
        </AppText>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  spark: {
    fontSize: 22,
  },
  stack: {},
});

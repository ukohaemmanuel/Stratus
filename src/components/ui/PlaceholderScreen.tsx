import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/theme';

import { AppCard } from './AppCard';
import { AppScreen } from './AppScreen';
import { AppText } from './AppText';

type PlaceholderScreenProps = {
  label: string;
};

export function PlaceholderScreen({ label }: PlaceholderScreenProps) {
  const theme = useAppTheme();

  return (
    <AppScreen>
      <View style={styles.content}>
        <AppCard variant="hero">
          <View style={[styles.cardContent, { gap: theme.spacing.sm }]}>
            <AppText muted variant="caption">
              Stratus
            </AppText>
            <AppText variant="title">{label}</AppText>
          </View>
        </AppCard>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  cardContent: {},
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});

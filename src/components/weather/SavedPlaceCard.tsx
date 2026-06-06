import { Pressable, StyleSheet, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { AppPill } from '@/components/ui/AppPill';
import { AppText } from '@/components/ui/AppText';
import type { MockPlace } from '@/data/mockPlaces';
import { useAppTheme } from '@/theme';

type SavedPlaceCardProps = {
  onPress?: () => void;
  place: MockPlace;
};

export function SavedPlaceCard({ onPress, place }: SavedPlaceCardProps) {
  const theme = useAppTheme();

  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      {({ pressed }) => (
        <AppCard style={{ opacity: pressed ? 0.82 : 1 }}>
          <View style={[styles.row, { gap: theme.spacing.md }]}>
            <View
              style={[
                styles.iconBubble,
                {
                  backgroundColor: theme.colors.cardMuted,
                  borderRadius: theme.radii.full,
                },
              ]}
            >
              <AppText style={styles.icon}>{place.icon}</AppText>
            </View>
            <View style={styles.main}>
              <View style={[styles.titleRow, { gap: theme.spacing.sm }]}>
                <AppText variant="body">{place.city}</AppText>
                {place.isCurrent ? <AppPill selected>Current</AppPill> : null}
              </View>
              <AppText muted variant="caption">
                {place.region}
              </AppText>
              <AppText muted variant="caption">
                {place.weatherMood} · {place.rainChance}% rain
              </AppText>
            </View>
            <View style={styles.end}>
              <AppText variant="heading">{place.temperature}°</AppText>
              <AppText muted variant="caption">
                ·
              </AppText>
            </View>
          </View>
        </AppCard>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  end: {
    alignItems: 'flex-end',
  },
  icon: {
    fontSize: 28,
  },
  iconBubble: {
    alignItems: 'center',
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  main: {
    flex: 1,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

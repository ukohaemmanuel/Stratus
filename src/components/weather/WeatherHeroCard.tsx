import { StyleSheet, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { useAppTheme } from '@/theme';

import { WeatherMoodPill } from './WeatherMoodPill';

type WeatherHeroCardProps = {
  condition: string;
  icon: string;
  location: string;
  mood: string;
  temperature: number;
};

export function WeatherHeroCard({
  condition,
  icon,
  location,
  mood,
  temperature,
}: WeatherHeroCardProps) {
  const theme = useAppTheme();

  return (
    <AppCard variant="hero">
      <View style={[styles.layout, { gap: theme.spacing.lg }]}>
        <View style={[styles.temperatureGroup, { gap: theme.spacing.sm }]}>
          <AppText muted variant="caption">
            {location}
          </AppText>
          <AppText variant="temperature">{temperature}°</AppText>
          <AppText variant="heading">{condition}</AppText>
          <WeatherMoodPill label={mood} />
        </View>
        <View
          style={[
            styles.mascot,
            {
              backgroundColor: theme.colors.cardMuted,
              borderColor: theme.colors.border,
              borderRadius: theme.radii.xl,
            },
          ]}
        >
          <View
            style={[
              styles.mascotGlow,
              {
                backgroundColor: theme.colors.heroAccent,
                borderRadius: theme.radii.full,
              },
            ]}
          />
          <AppText style={styles.mascotIcon}>{icon}</AppText>
        </View>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  layout: {
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mascot: {
    alignItems: 'center',
    aspectRatio: 1,
    borderWidth: 1,
    justifyContent: 'center',
    minWidth: 128,
    overflow: 'hidden',
    position: 'relative',
  },
  mascotGlow: {
    height: 96,
    opacity: 0.76,
    position: 'absolute',
    width: 96,
  },
  mascotIcon: {
    fontSize: 72,
  },
  temperatureGroup: {
    flex: 1,
    justifyContent: 'center',
  },
});

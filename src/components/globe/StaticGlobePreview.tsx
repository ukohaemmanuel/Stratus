import { StyleSheet, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/IconButton';
import type { MockPlace } from '@/data/mockPlaces';
import { useAppTheme } from '@/theme';

type StaticGlobePreviewProps = {
  places: MockPlace[];
  selectedPlace: MockPlace;
};

const pinPositions = [
  { top: '24%', left: '44%' },
  { top: '32%', left: '51%' },
  { top: '29%', left: '47%' },
  { top: '58%', left: '50%' },
  { top: '35%', left: '55%' },
  { top: '42%', left: '22%' },
] as const;

export function StaticGlobePreview({ places, selectedPlace }: StaticGlobePreviewProps) {
  const theme = useAppTheme();

  return (
    <AppCard variant="hero">
      <View style={[styles.wrapper, { gap: theme.spacing.md }]}>
        <View
          style={[
            styles.globe,
            {
              backgroundColor: theme.colors.globeWater,
              borderColor: theme.colors.border,
              borderRadius: theme.radii.full,
            },
          ]}
        >
          <View
            style={[
              styles.land,
              {
                backgroundColor: theme.colors.globeLand,
                borderRadius: theme.radii.full,
              },
            ]}
          />
          <View
            style={[
              styles.landSmall,
              {
                backgroundColor: theme.colors.heroAccent,
                borderRadius: theme.radii.full,
              },
            ]}
          />
          {places.map((place, index) => {
            const position = pinPositions[index % pinPositions.length];
            const selected = place.id === selectedPlace.id;
            return (
              <View
                key={place.id}
                style={[
                  styles.pin,
                  position,
                  {
                    backgroundColor: selected ? theme.colors.globePinSelected : theme.colors.card,
                    borderColor: selected ? theme.colors.globePinSelected : theme.colors.globePin,
                    borderRadius: theme.radii.full,
                  },
                ]}
              />
            );
          })}
          <View
            style={[
              styles.tooltip,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                borderRadius: theme.radii.md,
              },
              theme.shadows.card,
            ]}
          >
            <AppText variant="caption">{selectedPlace.city}</AppText>
            <AppText muted variant="caption">
              {selectedPlace.temperature}° · {selectedPlace.condition}
            </AppText>
          </View>
          <View
            style={[
              styles.shine,
              {
                backgroundColor: theme.colors.globePin,
                borderRadius: theme.radii.full,
              },
            ]}
          />
        </View>
        <View style={[styles.controls, { gap: theme.spacing.sm }]}>
          <IconButton label="Zoom in" symbol="+" />
          <IconButton label="Zoom out" symbol="-" />
        </View>
        <AppText muted style={styles.hint} variant="caption">
          Drag to rotate · Pinch to zoom
        </AppText>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  globe: {
    alignSelf: 'center',
    aspectRatio: 1,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    width: '96%',
  },
  hint: {
    textAlign: 'center',
  },
  land: {
    height: '42%',
    left: '9%',
    position: 'absolute',
    top: '18%',
    transform: [{ rotate: '-18deg' }],
    width: '55%',
  },
  landSmall: {
    bottom: '12%',
    height: '28%',
    position: 'absolute',
    right: '12%',
    transform: [{ rotate: '22deg' }],
    width: '38%',
  },
  pin: {
    borderWidth: 3,
    height: 18,
    position: 'absolute',
    width: 18,
    zIndex: 3,
  },
  shine: {
    height: '26%',
    left: '18%',
    opacity: 0.22,
    position: 'absolute',
    top: '10%',
    width: '26%',
  },
  tooltip: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    position: 'absolute',
    right: '7%',
    top: '14%',
    zIndex: 4,
  },
  wrapper: {
    position: 'relative',
  },
});

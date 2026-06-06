import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/theme';

import { AppButton } from './AppButton';
import { AppCard } from './AppCard';
import { AppText } from './AppText';

type EmptyStateProps = {
  actionLabel?: string;
  illustration: string;
  onAction?: () => void;
  subtitle: string;
  title: string;
};

export function EmptyState({
  actionLabel,
  illustration,
  onAction,
  subtitle,
  title,
}: EmptyStateProps) {
  const theme = useAppTheme();

  return (
    <AppCard variant="hero">
      <View style={[styles.content, { gap: theme.spacing.md }]}>
        <View
          style={[
            styles.illustrationWrap,
            {
              backgroundColor: theme.colors.heroAccent,
              borderRadius: theme.radii.full,
            },
          ]}
        >
          <AppText style={styles.illustration}>{illustration}</AppText>
        </View>
        <AppText variant="title">{title}</AppText>
        <AppText muted style={styles.subtitle}>
          {subtitle}
        </AppText>
        {actionLabel ? <AppButton onPress={onAction}>{actionLabel}</AppButton> : null}
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
  },
  illustration: {
    fontSize: 64,
  },
  illustrationWrap: {
    alignItems: 'center',
    height: 124,
    justifyContent: 'center',
    width: 124,
  },
  subtitle: {
    textAlign: 'center',
  },
});

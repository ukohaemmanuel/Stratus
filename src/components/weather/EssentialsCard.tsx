import { StyleSheet, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { AppPill } from '@/components/ui/AppPill';
import { AppText } from '@/components/ui/AppText';
import { useAppTheme } from '@/theme';

type EssentialsCardProps = {
  items: string[];
  title?: string;
};

export function EssentialsCard({ items, title = "Today's Essentials" }: EssentialsCardProps) {
  const theme = useAppTheme();

  return (
    <AppCard variant="muted">
      <View style={[styles.stack, { gap: theme.spacing.md }]}>
        <AppText variant="heading">{title}</AppText>
        <View style={[styles.pills, { gap: theme.spacing.sm }]}>
          {items.map((item, index) => (
            <AppPill key={item} selected={index === 0}>
              {item}
            </AppPill>
          ))}
        </View>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  stack: {},
});

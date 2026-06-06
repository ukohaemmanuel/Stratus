import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/theme';

import { AppText } from './AppText';

type SectionHeaderProps = {
  subtitle?: string;
  title: string;
};

export function SectionHeader({ subtitle, title }: SectionHeaderProps) {
  const theme = useAppTheme();

  return (
    <View style={[styles.container, { gap: theme.spacing.xs }]}>
      <AppText variant="heading">{title}</AppText>
      {subtitle ? (
        <AppText muted variant="body">
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    paddingTop: 2,
  },
});

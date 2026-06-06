import { StyleSheet } from 'react-native';

import { AppPill } from '@/components/ui/AppPill';
import { useAppTheme } from '@/theme';

type WeatherMoodPillProps = {
  label: string;
};

export function WeatherMoodPill({ label }: WeatherMoodPillProps) {
  const theme = useAppTheme();

  return (
    <AppPill
      selected
      textColor={theme.colors.text}
      style={[
        styles.pill,
        {
          backgroundColor: theme.colors.accent,
          borderColor: theme.colors.accent,
          paddingHorizontal: theme.spacing.lg,
        },
      ]}
    >
      {label}
    </AppPill>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
  },
});

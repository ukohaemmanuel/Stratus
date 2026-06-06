import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, View } from 'react-native';

import { alpha } from '@/theme/colorUtils';
import { useAppTheme } from '@/theme';
import type { IconKey } from '../../assets/icons';
import { AppIcon } from './AppIcon';
import { AppText } from './AppText';

const TAB_ICONS: Record<string, IconKey> = {
  today: 'homeSmileBold',
  forecast: 'calendarMinimalisticBold',
  globe: 'earthBold',
  places: 'mapPointWaveBold',
  settings: 'settingsMinimalisticBold',
};

export function CustomTabBar({ navigation, state }: BottomTabBarProps) {
  const theme = useAppTheme();

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: alpha(theme.colors.tabBar, 0.90),
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        borderTopLeftRadius: theme.radii.roundedTop3rem,
        borderTopRightRadius: theme.radii.roundedTop3rem,
        paddingHorizontal: theme.spacing.px4,
        paddingTop: theme.spacing.py4,
        paddingBottom: theme.spacing.py4,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const color = focused ? theme.colors.primary : theme.colors.mutedText;
        const iconName = TAB_ICONS[route.name];

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={{
              width: 64,
              height: 64,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
            activeOpacity={0.7}
          >
            {focused && (
              <View
                style={{
                  position: 'absolute',
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: alpha(theme.colors.primary, 0.10),
                }}
              />
            )}
            {iconName ? (
              <AppIcon name={iconName} size={28} color={color} />
            ) : null}
            <AppText
              variant="label"
              style={{
                color,
                fontSize: 9,
                marginTop: 2,
                letterSpacing: 0,
              }}
            >
              {route.name.charAt(0).toUpperCase() + route.name.slice(1)}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

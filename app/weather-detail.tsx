import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppIcon, type IconName } from '@/components/ui/AppIcon';
import { alpha, themeColor } from '@/theme/colorUtils';
import { sleekTokens, type ThemeColorToken, useAppTheme } from '@/theme';

const mascotRainy = require('../assets/images/mascots/mascot-rainy.png');

const hourlyTimeline: Array<{
  time: string;
  icon: IconName;
  iconColor: ThemeColorToken;
  temp: number;
  progress: number;
}> = [
  { time: '09 AM', icon: 'solar-cloud-sun-bold', iconColor: 'secondary', temp: 16, progress: 0.4 },
  { time: '12 PM', icon: 'solar-clouds-bold', iconColor: 'primary', temp: 18, progress: 0.7 },
  { time: '03 PM', icon: 'solar-cloud-rain-bold', iconColor: 'accent', temp: 17, progress: 0.9 },
  { time: '06 PM', icon: 'solar-wind-bold', iconColor: 'secondary', temp: 15, progress: 0.6 },
];

export default function WeatherDetailScreen() {
  const theme = useAppTheme();
  const r = sleekTokens.radii;
  const t = theme.colors;
  const params = useLocalSearchParams<{ city?: string; day?: string }>();
  const city = params.city ?? 'Newcastle';
  const day = params.day ?? 'Friday';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.background }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            gap: 16,
            paddingBottom: 24,
            paddingHorizontal: 24,
            paddingTop: 12,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => router.back()}
            style={{
              alignItems: 'center',
              backgroundColor: t.card,
              borderColor: t.border,
              borderRadius: r.full,
              borderWidth: 1,
              height: 48,
              justifyContent: 'center',
              shadowColor: t.primary,
              shadowOpacity: 0.06,
              shadowRadius: 8,
              width: 48,
            }}
          >
            <AppIcon name="solar-alt-arrow-left-bold" size={24} color={t.text} />
          </TouchableOpacity>
          <View>
            <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 24, lineHeight: 28 }}>
              {day}
            </Text>
            <Text
              style={{
                color: t.mutedText,
                fontFamily: 'Quicksand_700Bold',
                fontSize: 12,
                letterSpacing: 1.5,
                marginTop: 2,
                textTransform: 'uppercase',
              }}
            >
              {city} · May 28
            </Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 24 }}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: t.card,
              borderColor: t.border,
              borderRadius: r.rounded3rem,
              borderWidth: 1,
              marginBottom: 16,
              overflow: 'hidden',
              padding: 40,
              position: 'relative',
              shadowColor: t.primary,
              shadowOpacity: 0.06,
              shadowRadius: 8,
            }}
          >
            <View style={{ opacity: 0.03, position: 'absolute', right: 0, top: 0, transform: [{ rotate: '12deg' }] }}>
              <AppIcon name="solar-cloud-rain-bold" size={180} color={t.text} />
            </View>
            <Image source={mascotRainy} style={{ height: 192, marginBottom: 16, width: 192, zIndex: 1 }} contentFit="contain" />
            <View style={{ alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'center', zIndex: 1 }}>
              <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 96, lineHeight: 100 }}>
                18°
              </Text>
              <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 30, marginTop: 24 }}>
                /14°
              </Text>
            </View>
            <Text style={{ color: t.accent, fontFamily: 'Quicksand_700Bold', fontSize: 24, marginTop: 8, zIndex: 1 }}>
              Windy boss battle
            </Text>
          </View>
        </View>

        <View style={{ gap: 16, paddingHorizontal: 24 }}>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <MetricCard icon="solar-waterdrop-bold" iconColor={t.primary} label="Rain chance" value="85%" />
            <MetricCard icon="solar-wind-bold" iconColor={t.secondary} label="Wind Speed" value="18 mph" />
          </View>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <MetricCard icon="solar-thermometer-bold" iconColor={t.accent} label="Feels Like" value="14°" />
            <MetricCard icon="solar-sun-fog-bold" iconColor={t.secondary} label="UV Index" value="Low" />
          </View>
        </View>

        <View
          style={{
            backgroundColor: alpha(t.primary, 0.05),
            borderColor: alpha(t.primary, 0.10),
            borderRadius: r.rounded2_5rem,
            borderWidth: 1,
            marginHorizontal: 24,
            marginTop: 16,
            overflow: 'hidden',
            padding: 32,
          }}
        >
          <View style={{ bottom: -24, opacity: 0.08, position: 'absolute', right: -24 }}>
            <AppIcon name="solar-shield-user-bold" size={120} color={t.primary} />
          </View>
          <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 20, marginBottom: 12 }}>
            Weather-ready summary
          </Text>
          <Text style={{ color: alpha(t.primary, 0.70), fontFamily: 'Quicksand_700Bold', fontSize: 16, lineHeight: 24 }}>
            Layer up in the morning. Rain risk is low, but it gets breezy later. A wind-resistant jacket is recommended for your walk!
          </Text>
        </View>

        <View style={{ marginTop: 16, paddingHorizontal: 24 }}>
          <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 20, marginBottom: 16, paddingHorizontal: 8 }}>
            Hourly Timeline
          </Text>
          <View
            style={{
              backgroundColor: t.card,
              borderColor: t.border,
              borderRadius: r.rounded3rem,
              borderWidth: 1,
              gap: 24,
              padding: 32,
              shadowColor: t.primary,
              shadowOpacity: 0.06,
              shadowRadius: 8,
            }}
          >
            {hourlyTimeline.map((item) => {
              const color = themeColor(theme, item.iconColor);

              return (
                <View key={item.time} style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: t.mutedText, fontFamily: 'Quicksand_700Bold', fontSize: 12, width: 54 }}>
                    {item.time}
                  </Text>
                  <AppIcon name={item.icon} size={28} color={color} />
                  <View
                    style={{
                      backgroundColor: t.background,
                      borderColor: alpha(t.border, 0.5),
                      borderRadius: r.full,
                      borderWidth: 1,
                      flex: 1,
                      height: 8,
                      marginHorizontal: 24,
                      overflow: 'hidden',
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: color,
                        borderRadius: r.full,
                        height: '100%',
                        opacity: 0.8,
                        width: `${item.progress * 100}%`,
                      }}
                    />
                  </View>
                  <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 16 }}>
                    {item.temp}°
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MetricCard({
  icon,
  iconColor,
  label,
  value,
}: {
  icon: IconName;
  iconColor: string;
  label: string;
  value: string;
}) {
  const theme = useAppTheme();
  const r = sleekTokens.radii;
  const t = theme.colors;

  return (
    <View
      style={{
        backgroundColor: t.card,
        borderColor: t.border,
        borderRadius: r.rounded2_5rem,
        borderWidth: 1,
        flex: 1,
        gap: 12,
        padding: 24,
        shadowColor: t.primary,
        shadowOpacity: 0.06,
        shadowRadius: 8,
      }}
    >
      <Text
        style={{
          color: t.mutedText,
          fontFamily: 'Quicksand_700Bold',
          fontSize: 10,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
      <View style={{ alignItems: 'center', flexDirection: 'row', gap: 12 }}>
        <AppIcon name={icon} size={24} color={iconColor} />
        <Text style={{ color: t.text, fontFamily: 'Quicksand_700Bold', fontSize: 24 }}>
          {value}
        </Text>
      </View>
    </View>
  );
}

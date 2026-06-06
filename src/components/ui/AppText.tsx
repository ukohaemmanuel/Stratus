import type { PropsWithChildren } from 'react';
import { Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import { useAppTheme } from '@/theme';
import { sleekTokens } from '@/theme/sleekTokens';

export type AppTextVariant =
  | 'title'       // 30px black/700 screen headings (text-3xl)
  | 'heading'     // 24px black/700 section headings (text-2xl)
  | 'body'        // 16px 500 body copy (text-base)
  | 'caption'     // 12px 500 secondary text (text-xs)
  | 'temperature' // 96px black/700 big weather number (text-8xl)
  | 'label';      // 10px black/700 uppercase chips/badges (text-[10px])

type AppTextProps = PropsWithChildren<
  TextProps & {
    muted?: boolean;
    style?: StyleProp<TextStyle>;
    variant?: AppTextVariant;
    tracking?: boolean;
  }
>;

const FONT_FAMILY: Record<AppTextVariant, string> = {
  title: sleekTokens.fontFamilies.black,
  heading: sleekTokens.fontFamilies.black,
  body: sleekTokens.fontFamilies.medium,
  caption: sleekTokens.fontFamilies.medium,
  temperature: sleekTokens.fontFamilies.black,
  label: sleekTokens.fontFamilies.black,
};

const FONT_SIZE: Record<AppTextVariant, number> = {
  title: 30,
  heading: 24,
  body: 16,
  caption: 12,
  temperature: 96,
  label: 10,
};

const FONT_WEIGHT: Record<AppTextVariant, TextStyle['fontWeight']> = {
  title: sleekTokens.fontWeights.black as TextStyle['fontWeight'],
  heading: sleekTokens.fontWeights.black as TextStyle['fontWeight'],
  body: sleekTokens.fontWeights.medium as TextStyle['fontWeight'],
  caption: sleekTokens.fontWeights.medium as TextStyle['fontWeight'],
  temperature: sleekTokens.fontWeights.black as TextStyle['fontWeight'],
  label: sleekTokens.fontWeights.black as TextStyle['fontWeight'],
};

export function AppText({
  children,
  muted = false,
  style,
  tracking = false,
  variant = 'body',
  ...textProps
}: AppTextProps) {
  const theme = useAppTheme();

  return (
    <Text
      {...textProps}
      style={[
        {
          color: muted ? theme.colors.mutedText : theme.colors.text,
          fontFamily: FONT_FAMILY[variant],
          fontSize: FONT_SIZE[variant],
          fontWeight: FONT_WEIGHT[variant],
          letterSpacing: tracking ? 1.5 : 0,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

import type { PropsWithChildren } from 'react';
import { ImageBackground, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppearanceStore } from '@/features/appearance/appearanceStore';
import { useAppTheme } from '@/theme';

type AppScreenProps = PropsWithChildren<{
  scroll?: boolean;
  safeArea?: boolean;
  backgroundImageUri?: string;
}>;

export function AppScreen({
  backgroundImageUri,
  children,
  safeArea = true,
  scroll = false,
}: AppScreenProps) {
  const theme = useAppTheme();
  const overlayOpacity = useAppearanceStore((state) => state.overlayOpacity);
  const Container = safeArea ? SafeAreaView : View;
  const Content = scroll ? ScrollView : View;

  const content = (
    <Container
      style={[
        styles.container,
        { backgroundColor: backgroundImageUri ? 'transparent' : theme.colors.background },
      ]}
    >
      <Content
        contentContainerStyle={
          scroll
            ? [
                styles.scrollContent,
                {
                  paddingHorizontal: theme.spacing.lg,
                  paddingTop: theme.spacing.lg,
                  paddingBottom: theme.spacing.xxl + theme.spacing.xl,
                  gap: theme.spacing.xl,
                },
              ]
            : undefined
        }
        style={
          scroll
            ? undefined
            : [
                styles.content,
                {
                  padding: theme.spacing.lg,
                  gap: theme.spacing.xl,
                },
              ]
        }
      >
        {children}
      </Content>
    </Container>
  );

  if (!backgroundImageUri) {
    return content;
  }

  return (
    <ImageBackground source={{ uri: backgroundImageUri }} style={styles.container}>
      <View
        style={[
          styles.overlay,
          {
            backgroundColor: theme.colors.overlay,
            opacity: overlayOpacity,
          },
        ]}
      />
      {content}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  overlay: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { LevelUpModal } from '../components/Game';
import { StoreProvider } from '../lib/store';
import { useColors } from '../theme';

export default function RootLayout() {
  const scheme = useColorScheme();
  const c = useColors();
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const theme = {
    ...base,
    colors: { ...base.colors, primary: c.accent, background: c.bg, card: c.bg, text: c.text, border: c.border },
  };
  const header = { headerShadowVisible: false, headerStyle: { backgroundColor: c.bg }, headerTintColor: c.text };

  return (
    <ThemeProvider value={theme}>
      <StoreProvider>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        <Stack screenOptions={{ contentStyle: { backgroundColor: c.bg } }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="welcome" options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="exercise/[id]" options={{ title: '', ...header }} />
          <Stack.Screen name="library" options={{ title: 'Exercises', ...header }} />
          <Stack.Screen name="settings" options={{ title: 'Settings', ...header }} />
        </Stack>
        <LevelUpModal />
      </StoreProvider>
    </ThemeProvider>
  );
}

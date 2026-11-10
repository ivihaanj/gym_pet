import { DarkTheme, DefaultTheme, Stack, ThemeProvider, type ErrorBoundaryProps } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Pressable, Text, useColorScheme, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LevelUpModal } from '../components/Game';
import { StoreProvider } from '../lib/store';
import { useColors } from '../theme';

// Never stay on the splash screen: hide it as soon as the app mounts,
// and as a backup after 3 seconds no matter what.
setTimeout(() => SplashScreen.hideAsync().catch(() => {}), 3000);

/** If anything crashes, show this instead of a frozen splash screen. */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: '#ECEEF3', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', color: '#1F2330' }}>Something went wrong</Text>
      <Text style={{ color: '#7A8091', textAlign: 'center' }}>{error.message}</Text>
      <Pressable onPress={retry} style={{ backgroundColor: '#5B5BD6', borderRadius: 24, paddingHorizontal: 24, height: 48, justifyContent: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Try again</Text>
      </Pressable>
      <Pressable
        onPress={async () => {
          await AsyncStorage.multiRemove(['gympet:v2', 'gympet:v1']).catch(() => {});
          retry();
        }}
      >
        <Text style={{ color: '#EF4444', fontWeight: '600' }}>Reset app data</Text>
      </Pressable>
    </View>
  );
}

export default function RootLayout() {
  const scheme = useColorScheme();
  const c = useColors();
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);
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

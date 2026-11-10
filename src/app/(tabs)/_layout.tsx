import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { useStore } from '../../lib/store';
import { useColors } from '../../theme';

export default function TabLayout() {
  const c = useColors();
  const { ready, data } = useStore();

  // First launch: ask for the name.
  if (ready && !data.name) return <Redirect href="/welcome" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.accent,
        tabBarInactiveTintColor: c.muted,
        tabBarStyle: { backgroundColor: c.bg, borderTopWidth: 0, elevation: 0 },
        sceneStyle: { backgroundColor: c.bg },
        animation: 'fade',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, size }) => <Ionicons name="today-outline" size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="days"
        options={{
          title: 'Plan',
          tabBarIcon: ({ color, size }) => <Ionicons name="list-outline" size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: 'Me',
          tabBarIcon: ({ color, size }) => <Ionicons name="trophy-outline" size={size} color={color as string} />,
        }}
      />
    </Tabs>
  );
}

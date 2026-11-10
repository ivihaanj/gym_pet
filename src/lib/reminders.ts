import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/** Show reminders even while the app is open. */
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

/** Ask for permission. Returns true if reminders can be shown. */
export async function askReminderPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('workouts', {
      name: 'Workout reminders',
      // eslint-disable-next-line import/namespace -- exported via 'export *' from a .d.ts enum; the lint resolver misses it
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.status === 'granted') return true;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.status === 'granted';
}

/** Replace all reminders with one weekly reminder per workout day. JS weekday 0 = Sunday. */
export async function syncReminders(
  r: { enabled: boolean; hour: number; minute: number },
  weekdays: number[],
  name: string | null,
): Promise<void> {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!r.enabled) return;
  const perm = await Notifications.getPermissionsAsync();
  if (perm.status !== 'granted') return;
  for (const w of weekdays) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: name ? `Time to train, ${name}!` : 'Time to train!',
        body: 'Warm up 5 min. Keep your streak going.',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: w + 1, // expo: 1 = Sunday
        hour: r.hour,
        minute: r.minute,
        channelId: 'workouts',
      },
    });
  }
}

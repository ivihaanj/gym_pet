import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameHeader } from '../../components/Game';
import { WorkoutView } from '../../components/WorkoutView';
import { WEEKDAY_NAMES } from '../../data/plan';
import { formatTime, nextWorkout, startOfToday } from '../../lib/dates';
import { useStore } from '../../lib/store';
import { useColors } from '../../theme';

export default function TodayScreen() {
  const c = useColors();
  const { ready, data } = useStore();
  const today = startOfToday();
  const weekday = today.getDay();
  const day = data.plan[weekday];

  if (!ready) return <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }} />;

  const time = data.reminder.enabled ? ` · ${formatTime(data.reminder.hour, data.reminder.minute)}` : '';

  if (day) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }} edges={['top']}>
        <WorkoutView
          weekday={weekday}
          date={today}
          heading={`Today · ${WEEKDAY_NAMES[weekday]}${time}`}
          header={<GameHeader />}
        />
      </SafeAreaView>
    );
  }

  const next = nextWorkout(data.plan, today);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ padding: 20 }}>
        <GameHeader />
      </View>
      <View style={styles.rest}>
        <View style={[styles.icon, c.raised]}>
          <Image source={require('../../../assets/mascot.png')} style={{ width: 84, height: 84 }} contentFit="contain" />
        </View>
        <Text style={[styles.title, { color: c.text }]}>Rest day</Text>
        <Text style={{ color: c.muted }}>Your pet is resting too.</Text>
        {next ? (
          <Text style={[styles.sub, { color: c.muted }]}>
            Next: {WEEKDAY_NAMES[next.date.getDay()]} · {next.day.title}
          </Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rest: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 24, marginTop: -60 },
  icon: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  title: { fontSize: 28, fontWeight: '700' },
  sub: { fontSize: 16, textAlign: 'center' },
});

import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WorkoutView } from '../../components/WorkoutView';
import { nextWorkout, startOfToday, workoutFor } from '../../lib/dates';
import { useStore } from '../../lib/store';
import { useColors } from '../../theme';

export default function TodayScreen() {
  const c = useColors();
  const { ready } = useStore();
  const today = startOfToday();
  const day = workoutFor(today);

  if (!ready) return <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }} />;

  if (day) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }} edges={['top']}>
        <WorkoutView day={day} date={today} heading={`Today · ${day.name}`} />
      </SafeAreaView>
    );
  }

  const next = nextWorkout(today);
  return (
    <SafeAreaView style={[styles.rest, { backgroundColor: c.bg }]}>
      <View style={[styles.icon, { backgroundColor: c.accentSoft }]}>
        <Ionicons name="moon-outline" size={32} color={c.accent} />
      </View>
      <Text style={[styles.title, { color: c.text }]}>Rest day</Text>
      <Text style={[styles.sub, { color: c.muted }]}>
        Next: {next.day.name} · {next.day.title}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rest: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 24 },
  icon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  title: { fontSize: 28, fontWeight: '700' },
  sub: { fontSize: 16 },
});

import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WorkoutView } from '../../components/WorkoutView';
import { DAYS } from '../../data/plan';
import { dateInThisWeek, startOfToday } from '../../lib/dates';
import { useStore } from '../../lib/store';
import { useColors } from '../../theme';

export default function DaysScreen() {
  const c = useColors();
  const store = useStore();
  const todayWeekday = startOfToday().getDay();
  const [weekday, setWeekday] = useState(
    DAYS.some((d) => d.weekday === todayWeekday) ? todayWeekday : DAYS[0].weekday,
  );
  const day = DAYS.find((d) => d.weekday === weekday)!;
  const date = dateInThisWeek(weekday);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }} edges={['top']}>
      <View style={[styles.tabs, { backgroundColor: c.surface }]}>
        {DAYS.map((d) => {
          const active = d.weekday === weekday;
          const status = store.status(dateInThisWeek(d.weekday));
          return (
            <Pressable
              key={d.short}
              onPress={() => setWeekday(d.weekday)}
              style={[styles.tab, active && { backgroundColor: c.bg }]}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={d.name}
            >
              <Text style={[styles.tabText, { color: active ? c.text : c.muted }]}>{d.short}</Text>
              {status === 'complete' ? <View style={[styles.dot, { backgroundColor: c.green }]} /> : null}
            </Pressable>
          );
        })}
      </View>
      {store.ready ? <WorkoutView key={weekday} day={day} date={date} heading={day.name} /> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', margin: 20, marginBottom: 0, padding: 4, borderRadius: 12 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 9, flexDirection: 'row', justifyContent: 'center', gap: 5 },
  tabText: { fontSize: 15, fontWeight: '600' },
  dot: { width: 6, height: 6, borderRadius: 3 },
});

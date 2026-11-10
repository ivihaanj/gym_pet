import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WorkoutView } from '../../components/WorkoutView';
import { WEEK_ORDER, WEEKDAY_NAMES, WEEKDAY_SHORT } from '../../data/plan';
import { dateInThisWeek, startOfToday } from '../../lib/dates';
import { useStore } from '../../lib/store';
import { useColors } from '../../theme';

export default function PlanScreen() {
  const c = useColors();
  const store = useStore();
  const days = WEEK_ORDER.filter((w) => store.data.plan[w]);
  const todayWeekday = startOfToday().getDay();
  const [picked, setPicked] = useState<number | null>(null);
  const weekday = picked !== null && days.includes(picked) ? picked : days.includes(todayWeekday) ? todayWeekday : days[0];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }} edges={['top']}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
        contentContainerStyle={[styles.tabs, c.inset]}
      >
        {days.map((w) => {
          const active = w === weekday;
          const status = store.status(dateInThisWeek(w));
          return (
            <Pressable
              key={w}
              onPress={() => setPicked(w)}
              style={[styles.tab, active && c.raisedSm]}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={WEEKDAY_NAMES[w]}
            >
              <Text style={[styles.tabText, { color: active ? c.text : c.muted }]}>{WEEKDAY_SHORT[w]}</Text>
              {status === 'complete' ? <View style={[styles.dot, { backgroundColor: c.green }]} /> : null}
            </Pressable>
          );
        })}
      </ScrollView>
      {store.ready && weekday !== undefined ? (
        <WorkoutView key={weekday} weekday={weekday} date={dateInThisWeek(weekday)} heading={WEEKDAY_NAMES[weekday]} editable />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabs: { margin: 20, marginBottom: 0, padding: 4, borderRadius: 12, flexGrow: 1 },
  tab: {
    minWidth: 52,
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 9,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  tabText: { fontSize: 15, fontWeight: '600' },
  dot: { width: 6, height: 6, borderRadius: 3 },
});

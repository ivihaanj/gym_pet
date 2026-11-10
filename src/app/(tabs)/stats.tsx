import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { dateKey, startOfToday } from '../../lib/dates';
import { useStore, type DayStatus } from '../../lib/store';
import { useColors, type Colors } from '../../theme';

const WEEK = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function fillFor(s: DayStatus, c: Colors): string {
  switch (s) {
    case 'complete': return c.green;
    case 'missed': return c.red;
    case 'partial': return c.yellow;
    case 'rest': return c.grey;
    default: return 'transparent';
  }
}

export default function StatsScreen() {
  const c = useColors();
  const store = useStore();
  const today = startOfToday();
  const todayKey = dateKey(today);
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const lead = (month.getDay() + 6) % 7; // Monday-first grid
  const cells: (Date | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)),
  ];
  while (cells.length % 7) cells.push(null);

  let done = 0;
  let missed = 0;
  for (const d of cells) {
    if (!d) continue;
    const s = store.status(d);
    if (s === 'complete') done++;
    if (s === 'missed') missed++;
  }
  const streak = store.game.streak;

  const shift = (n: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: c.text }]}>Stats</Text>

        <View style={styles.numbers}>
          <Stat label="Streak" value={streak} c={c} />
          <Stat label="Done" value={done} c={c} />
          <Stat label="Missed" value={missed} c={c} />
        </View>

        <View style={[styles.card, c.raised]}>
          <View style={styles.monthRow}>
            <Pressable onPress={() => shift(-1)} hitSlop={10} accessibilityLabel="Previous month">
              <Ionicons name="chevron-back" size={20} color={c.text} />
            </Pressable>
            <Text style={[styles.month, { color: c.text }]}>
              {MONTHS[month.getMonth()]} {month.getFullYear()}
            </Text>
            <Pressable onPress={() => shift(1)} hitSlop={10} accessibilityLabel="Next month">
              <Ionicons name="chevron-forward" size={20} color={c.text} />
            </Pressable>
          </View>

          <View style={styles.grid}>
            {WEEK.map((w, i) => (
              <Text key={`h${i}`} style={[styles.head, { color: c.muted }]}>
                {w}
              </Text>
            ))}
            {cells.map((d, i) => {
              if (!d) return <View key={`e${i}`} style={styles.cell} />;
              const s = store.status(d);
              const isToday = dateKey(d) === todayKey;
              const filled = s !== 'open';
              const textColor = s === 'rest' ? c.muted : filled ? '#fff' : c.text;
              return (
                <View key={i} style={styles.cell}>
                  <View
                    style={[
                      styles.dayCircle,
                      { backgroundColor: fillFor(s, c) },
                      isToday && { borderWidth: 2, borderColor: c.accent },
                    ]}
                    accessibilityLabel={`${d.getDate()} ${MONTHS[d.getMonth()]}: ${s}`}
                  >
                    <Text style={[styles.dayText, { color: textColor }]}>{d.getDate()}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.legend}>
          <Legend color={c.green} label="Done" c={c} />
          <Legend color={c.yellow} label="Partly" c={c} />
          <Legend color={c.red} label="Missed" c={c} />
          <Legend color={c.grey} label="Rest" c={c} />
          <Legend color="transparent" border={c.accent} label="Today" c={c} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value, c }: { label: string; value: number; c: Colors }) {
  return (
    <View style={[styles.stat, c.raised]}>
      <Text style={[styles.statValue, { color: c.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: c.muted }]}>{label}</Text>
    </View>
  );
}

function Legend({ color, border, label, c }: { color: string; border?: string; label: string; c: Colors }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }, border ? { borderWidth: 2, borderColor: border } : null]} />
      <Text style={[styles.legendText, { color: c.muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700' },
  numbers: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  statValue: { fontSize: 28, fontWeight: '700', fontVariant: ['tabular-nums'] },
  statLabel: { fontSize: 13, marginTop: 2 },
  card: { borderRadius: 16, padding: 14 },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, paddingHorizontal: 4 },
  month: { fontSize: 16, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  head: { width: `${100 / 7}%`, textAlign: 'center', fontSize: 12, fontWeight: '600', marginBottom: 6 },
  cell: { width: `${100 / 7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  dayCircle: { width: '84%', aspectRatio: 1, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  dayText: { fontSize: 14, fontWeight: '600' },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: 13 },
});

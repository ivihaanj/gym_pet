import Ionicons from '@expo/vector-icons/Ionicons';
import * as WebBrowser from 'expo-web-browser';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { PRESETS, SCHEDULE_NOTE, WEEK_ORDER, WEEKDAY_SHORT } from '../data/plan';
import { formatTime } from '../lib/dates';
import { askReminderPermission } from '../lib/reminders';
import { useStore } from '../lib/store';
import { useColors } from '../theme';

/** Pick a preset, or toggle single days (2 to 7). */
export function SchedulePicker() {
  const c = useColors();
  const store = useStore();
  const { presetId, plan } = store.data;
  const active = Object.keys(plan).map(Number);

  const toggleDay = (w: number) => {
    const next = active.includes(w) ? active.filter((x) => x !== w) : [...active, w];
    if (next.length < 2) return; // keep at least 2 days
    store.setWorkoutDays(next);
  };

  return (
    <View style={{ gap: 10 }}>
      {PRESETS.map((p) => {
        const on = presetId === p.id;
        return (
          <Pressable
            key={p.id}
            onPress={() => store.applyPreset(p.id)}
            style={[styles.preset, on ? c.inset : c.raisedSm]}
            accessibilityRole="radio"
            accessibilityState={{ selected: on }}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.presetName, { color: c.text }]}>
                {p.name}
                {p.id === 'original' ? '  ·  default' : ''}
              </Text>
              <Text style={{ color: c.muted, fontSize: 13 }}>{p.short}</Text>
            </View>
            <Ionicons name={on ? 'radio-button-on' : 'radio-button-off'} size={22} color={on ? c.accent : c.muted} />
          </Pressable>
        );
      })}

      <Text style={[styles.label, { color: c.muted }]}>Or pick your own days</Text>
      <View style={styles.days}>
        {WEEK_ORDER.map((w) => {
          const on = active.includes(w);
          return (
            <Pressable
              key={w}
              onPress={() => toggleDay(w)}
              style={[styles.day, on ? c.accentRaised : c.raisedSm]}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on }}
              accessibilityLabel={WEEKDAY_SHORT[w]}
            >
              <Text style={{ color: on ? c.onAccent : c.text, fontWeight: '700', fontSize: 13 }}>{WEEKDAY_SHORT[w]}</Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={{ color: c.muted, fontSize: 13 }}>
        {active.length} days a week{presetId === 'custom' ? ' · custom' : ''}
      </Text>
      <Pressable onPress={() => WebBrowser.openBrowserAsync(SCHEDULE_NOTE.sources[0].url).catch(() => {})}>
        <Text style={{ color: c.muted, fontSize: 13 }}>
          <Ionicons name="information-circle-outline" size={13} color={c.muted} /> {SCHEDULE_NOTE.text}
        </Text>
      </Pressable>
    </View>
  );
}

/** Workout time and reminder switch. */
export function TimePicker() {
  const c = useColors();
  const store = useStore();
  const r = store.data.reminder;
  const set = (patch: Partial<typeof r>) => store.setReminder({ ...r, ...patch });

  const step = (field: 'hour' | 'minute', dir: 1 | -1) => {
    if (field === 'hour') set({ hour: (r.hour + dir + 24) % 24 });
    else set({ minute: (r.minute + dir * 15 + 60) % 60 });
  };

  return (
    <View style={{ gap: 12 }}>
      <View style={[styles.timeBox, c.raised]}>
        <Stepper onMinus={() => step('hour', -1)} onPlus={() => step('hour', 1)} label="hour" />
        <Text style={[styles.time, { color: c.text }]}>{formatTime(r.hour, r.minute)}</Text>
        <Stepper onMinus={() => step('minute', -1)} onPlus={() => step('minute', 1)} label="minutes" />
      </View>
      <View style={[styles.switchRow, c.raised]}>
        <Ionicons name="notifications-outline" size={20} color={c.accent} />
        <Text style={{ color: c.text, flex: 1, fontSize: 15 }}>Remind me on workout days</Text>
        <Switch
          value={r.enabled}
          onValueChange={async (on) => {
            if (on) {
              const ok = await askReminderPermission().catch(() => false);
              set({ enabled: ok });
            } else set({ enabled: false });
          }}
          trackColor={{ true: c.accent, false: c.border }}
          thumbColor="#fff"
        />
      </View>
    </View>
  );
}

function Stepper({ onMinus, onPlus, label }: { onMinus: () => void; onPlus: () => void; label: string }) {
  const c = useColors();
  return (
    <View style={{ alignItems: 'center', gap: 6 }}>
      <Pressable onPress={onPlus} hitSlop={8} accessibilityLabel={`Later ${label}`}>
        <Ionicons name="chevron-up" size={22} color={c.text} />
      </Pressable>
      <Text style={{ color: c.muted, fontSize: 11 }}>{label}</Text>
      <Pressable onPress={onMinus} hitSlop={8} accessibilityLabel={`Earlier ${label}`}>
        <Ionicons name="chevron-down" size={22} color={c.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  preset: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, marginBottom: 2 },
  presetName: { fontSize: 16, fontWeight: '600' },
  label: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 8 },
  days: { flexDirection: 'row', gap: 6 },
  day: { flex: 1, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  timeBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 16, padding: 16 },
  time: { fontSize: 32, fontWeight: '700', fontVariant: ['tabular-nums'] },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14 },
});

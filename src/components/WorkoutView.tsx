import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EXERCISES, TOP_LINE, WALK, type WorkoutDay } from '../data/plan';
import { dateKey } from '../lib/dates';
import { useStore } from '../lib/store';
import { useColors } from '../theme';
import { CheckBox } from './CheckBox';
import { RestTimer } from './RestTimer';

type Props = { day: WorkoutDay; date: Date; heading?: string };

export function WorkoutView({ day, date, heading }: Props) {
  const c = useColors();
  const store = useStore();
  const key = dateKey(date);
  const { done, total } = store.progress(key);
  const complete = total > 0 && done === total;

  const bar = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(bar, { toValue: total ? done / total : 0, duration: 300, useNativeDriver: false }).start();
  }, [done, total, bar]);

  const pop = useRef(new Animated.Value(complete ? 1 : 0)).current;
  const wasComplete = useRef(complete);
  useEffect(() => {
    Animated.spring(pop, { toValue: complete ? 1 : 0, friction: 6, useNativeDriver: true }).start();
    if (complete && !wasComplete.current) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    wasComplete.current = complete;
  }, [complete, pop]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.content}>
        {heading ? <Text style={[styles.kicker, { color: c.accent }]}>{heading}</Text> : null}
        <Text style={[styles.title, { color: c.text }]}>{day.title}</Text>
        <Text style={[styles.topLine, { color: c.muted }]}>{TOP_LINE}</Text>

        <View style={styles.progressRow}>
          <View style={[styles.track, { backgroundColor: c.surface }]}>
            <Animated.View
              style={[
                styles.trackFill,
                {
                  backgroundColor: complete ? c.green : c.accent,
                  width: bar.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                },
              ]}
            />
          </View>
          <Text style={[styles.count, { color: c.muted }]}>
            {done}/{total}
          </Text>
        </View>

        {complete ? (
          <Animated.View
            style={[
              styles.banner,
              { backgroundColor: c.green, opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }] },
            ]}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.bannerText}>Day complete</Text>
          </Animated.View>
        ) : null}

        {day.exerciseIds.map((id, i) => {
          const ex = EXERCISES[id];
          return (
            <FadeIn key={id} delay={i * 40}>
              <View style={[styles.card, { backgroundColor: c.surface }]}>
                <Pressable
                  onPress={() => router.push({ pathname: '/exercise/[id]', params: { id } })}
                  style={styles.cardHead}
                  accessibilityRole="button"
                  accessibilityLabel={`${ex.name}, ${ex.sets} sets of ${ex.reps}. Open tips.`}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.exName, { color: c.text }]}>{ex.name}</Text>
                    <Text style={[styles.exReps, { color: c.muted }]}>
                      {ex.sets} x {ex.reps}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={c.muted} />
                </Pressable>
                <View style={styles.sets}>
                  {Array.from({ length: ex.sets }, (_, s) => {
                    const itemId = `${id}#${s + 1}`;
                    return (
                      <CheckBox
                        key={itemId}
                        label={String(s + 1)}
                        checked={store.isChecked(key, itemId)}
                        onPress={() => store.toggle(key, itemId)}
                        accessibilityLabel={`${ex.name} set ${s + 1}`}
                      />
                    );
                  })}
                </View>
              </View>
            </FadeIn>
          );
        })}

        <FadeIn delay={day.exerciseIds.length * 40}>
          <View style={[styles.card, styles.walk, { backgroundColor: c.surface }]}>
            <Ionicons name="walk-outline" size={22} color={c.accent} />
            <Text style={[styles.walkText, { color: c.text }]}>{WALK.label}</Text>
            <CheckBox
              checked={store.isChecked(key, WALK.id)}
              onPress={() => store.toggle(key, WALK.id)}
              accessibilityLabel={WALK.label}
            />
          </View>
        </FadeIn>
      </ScrollView>
      <RestTimer />
    </View>
  );
}

function FadeIn({ children, delay }: { children: React.ReactNode; delay: number }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: 260, delay, useNativeDriver: true }).start();
  }, [v, delay]);
  return (
    <Animated.View
      style={{ opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }] }}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 100, gap: 12 },
  kicker: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  title: { fontSize: 28, fontWeight: '700' },
  topLine: { fontSize: 15, marginTop: -4 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 6 },
  track: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  trackFill: { height: 6, borderRadius: 3 },
  count: { fontSize: 13, fontVariant: ['tabular-nums'] },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 14,
  },
  bannerText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  card: { borderRadius: 16, padding: 16, gap: 14 },
  cardHead: { flexDirection: 'row', alignItems: 'center' },
  exName: { fontSize: 17, fontWeight: '600' },
  exReps: { fontSize: 14, marginTop: 2 },
  sets: { flexDirection: 'row', gap: 12 },
  walk: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  walkText: { flex: 1, fontSize: 15, fontWeight: '500' },
});

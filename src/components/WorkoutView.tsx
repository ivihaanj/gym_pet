import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { EXERCISES, TOP_LINE, WALK, XP, type PlanItem } from '../data/plan';
import { dateKey } from '../lib/dates';
import { useStore } from '../lib/store';
import { useColors, type Colors } from '../theme';
import { CheckBox } from './CheckBox';
import { RestTimer } from './RestTimer';

type Props = {
  weekday: number;
  date: Date;
  heading?: string;
  editable?: boolean;
  header?: React.ReactNode;
};

export function WorkoutView({ weekday, date, heading, editable, header }: Props) {
  const c = useColors();
  const store = useStore();
  const day = store.data.plan[weekday];
  const key = dateKey(date);
  const { done, total } = store.progress(key);
  const complete = total > 0 && done === total;
  const [editing, setEditing] = useState(false);

  const bar = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(bar, { toValue: total ? done / total : 0, duration: 300, useNativeDriver: false }).start();
  }, [done, total, bar]);

  // "+10 XP" pop when a box is ticked.
  const xpPop = useRef(new Animated.Value(0)).current;
  const lastDone = useRef(done);
  useEffect(() => {
    if (done > lastDone.current) {
      xpPop.setValue(0);
      Animated.timing(xpPop, { toValue: 1, duration: 700, useNativeDriver: true }).start();
    }
    lastDone.current = done;
  }, [done, xpPop]);

  const pop = useRef(new Animated.Value(complete ? 1 : 0)).current;
  const wasComplete = useRef(complete);
  useEffect(() => {
    Animated.spring(pop, { toValue: complete ? 1 : 0, friction: 6, useNativeDriver: true }).start();
    if (complete && !wasComplete.current) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    wasComplete.current = complete;
  }, [complete, pop]);

  if (!day) return null;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {header}
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            {heading ? <Text style={[styles.kicker, { color: c.accent }]}>{heading}</Text> : null}
            {editing ? (
              <TextInput
                value={day.title}
                onChangeText={(t) => store.setDayTitle(weekday, t)}
                style={[styles.title, styles.titleInput, { color: c.text, borderColor: c.border }]}
                placeholder="Day name"
                placeholderTextColor={c.muted}
              />
            ) : (
              <Text style={[styles.title, { color: c.text }]}>{day.title}</Text>
            )}
          </View>
          {editable ? (
            <Pressable
              onPress={() => setEditing((e) => !e)}
              style={[styles.editBtn, editing ? c.accentRaised : c.raisedSm]}
              accessibilityRole="button"
              accessibilityLabel={editing ? 'Done editing' : 'Edit this day'}
            >
              <Ionicons name={editing ? 'checkmark' : 'create-outline'} size={16} color={editing ? c.onAccent : c.text} />
              <Text style={{ color: editing ? c.onAccent : c.text, fontWeight: '600' }}>{editing ? 'Done' : 'Edit'}</Text>
            </Pressable>
          ) : null}
        </View>
        <Text style={[styles.topLine, { color: c.muted }]}>{TOP_LINE}</Text>

        {!editing ? (
          <View style={styles.progressRow}>
            <View style={[styles.track, c.inset]}>
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
            <Animated.Text
              style={[
                styles.xpPop,
                {
                  color: c.accent,
                  opacity: xpPop.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 1, 0] }),
                  transform: [{ translateY: xpPop.interpolate({ inputRange: [0, 1], outputRange: [0, -18] }) }],
                },
              ]}
            >
              +{XP.perTick} XP
            </Animated.Text>
          </View>
        ) : null}

        {complete && !editing ? (
          <Animated.View
            style={[
              styles.banner,
              {
                backgroundColor: c.green,
                opacity: pop,
                transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }],
              },
            ]}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.bannerText}>Day complete · +{XP.dayComplete} XP</Text>
          </Animated.View>
        ) : null}

        {day.items.length === 0 ? (
          <Text style={{ color: c.muted, textAlign: 'center', marginVertical: 12 }}>No exercises yet.</Text>
        ) : null}

        {day.items.map((item, i) =>
          editing ? (
            <EditCard key={item.uid} item={item} weekday={weekday} first={i === 0} last={i === day.items.length - 1} c={c} />
          ) : (
            <FadeIn key={item.uid} delay={i * 40}>
              <View style={[styles.card, c.raised]}>
                <Pressable
                  onPress={() => router.push({ pathname: '/exercise/[id]', params: { id: item.exerciseId } })}
                  style={styles.cardHead}
                  accessibilityRole="button"
                  accessibilityLabel={`${EXERCISES[item.exerciseId]?.name}, ${item.sets} sets of ${item.reps}. Open tips.`}
                >
                  <Thumb exerciseId={item.exerciseId} c={c} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.exName, { color: c.text }]}>{EXERCISES[item.exerciseId]?.name}</Text>
                    <Text style={[styles.exReps, { color: c.muted }]}>
                      {item.sets} x {item.reps}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={c.muted} />
                </Pressable>
                <View style={styles.sets}>
                  {Array.from({ length: item.sets }, (_, s) => {
                    const itemId = `${item.uid}#${s + 1}`;
                    return (
                      <CheckBox
                        key={itemId}
                        label={String(s + 1)}
                        checked={store.isChecked(key, itemId)}
                        onPress={() => store.toggle(key, itemId)}
                        accessibilityLabel={`${EXERCISES[item.exerciseId]?.name} set ${s + 1}`}
                      />
                    );
                  })}
                </View>
              </View>
            </FadeIn>
          ),
        )}

        {editing ? (
          <Pressable
            onPress={() => router.push({ pathname: '/library', params: { weekday: String(weekday) } })}
            style={[styles.addBtn, { borderColor: c.accent }]}
            accessibilityRole="button"
          >
            <Ionicons name="add" size={20} color={c.accent} />
            <Text style={{ color: c.accent, fontWeight: '600', fontSize: 15 }}>Add exercise</Text>
          </Pressable>
        ) : (
          <FadeIn delay={day.items.length * 40}>
            <View style={[styles.card, styles.walk, c.raised]}>
              <Ionicons name="walk-outline" size={22} color={c.accent} />
              <Text style={[styles.walkText, { color: c.text }]}>{WALK.label}</Text>
              <CheckBox
                checked={store.isChecked(key, WALK.id)}
                onPress={() => store.toggle(key, WALK.id)}
                accessibilityLabel={WALK.label}
              />
            </View>
          </FadeIn>
        )}
      </ScrollView>
      {!editing ? <RestTimer /> : null}
    </View>
  );
}

function Thumb({ exerciseId, c }: { exerciseId: string; c: Colors }) {
  const ex = EXERCISES[exerciseId];
  const src = ex?.gif ?? (ex?.gifUrl ? { uri: ex.gifUrl } : null);
  return (
    <View style={[styles.thumb, { backgroundColor: src ? '#fff' : c.bg }]}>
      {src ? (
        <Image source={src} style={styles.thumbImg} contentFit="contain" autoplay={false} cachePolicy="disk" />
      ) : (
        <Ionicons name="barbell-outline" size={20} color={c.muted} />
      )}
    </View>
  );
}

function EditCard({ item, weekday, first, last, c }: { item: PlanItem; weekday: number; first: boolean; last: boolean; c: Colors }) {
  const store = useStore();
  const ex = EXERCISES[item.exerciseId];
  const icon = (name: keyof typeof Ionicons.glyphMap, onPress: () => void, label: string, disabled = false, color = c.text) => (
    <Pressable onPress={onPress} disabled={disabled} hitSlop={6} style={[styles.iconBtn, { opacity: disabled ? 0.3 : 1 }]} accessibilityLabel={label}>
      <Ionicons name={name} size={18} color={color} />
    </Pressable>
  );
  return (
    <View style={[styles.card, c.raised, { gap: 12 }]}>
      <View style={styles.cardHead}>
        <Thumb exerciseId={item.exerciseId} c={c} />
        <Text style={[styles.exName, { color: c.text, flex: 1 }]}>{ex?.name}</Text>
        {icon('arrow-up', () => store.moveItem(weekday, item.uid, -1), 'Move up', first)}
        {icon('arrow-down', () => store.moveItem(weekday, item.uid, 1), 'Move down', last)}
        {icon(
          'swap-horizontal',
          () => router.push({ pathname: '/library', params: { weekday: String(weekday), replace: item.uid } }),
          'Replace exercise',
        )}
        {icon('trash-outline', () => store.removeItem(weekday, item.uid), 'Remove exercise', false, c.red)}
      </View>
      <View style={styles.editRow}>
        <Text style={[styles.editLabel, { color: c.muted }]}>Sets</Text>
        <View style={[styles.stepper, c.inset]}>
          <Pressable
            onPress={() => store.updateItem(weekday, item.uid, { sets: Math.max(1, item.sets - 1) })}
            hitSlop={6}
            accessibilityLabel="Fewer sets"
          >
            <Ionicons name="remove" size={18} color={c.text} />
          </Pressable>
          <Text style={[styles.stepVal, { color: c.text }]}>{item.sets}</Text>
          <Pressable
            onPress={() => store.updateItem(weekday, item.uid, { sets: Math.min(6, item.sets + 1) })}
            hitSlop={6}
            accessibilityLabel="More sets"
          >
            <Ionicons name="add" size={18} color={c.text} />
          </Pressable>
        </View>
        <Text style={[styles.editLabel, { color: c.muted }]}>Reps</Text>
        <TextInput
          value={item.reps}
          onChangeText={(reps) => store.updateItem(weekday, item.uid, { reps })}
          style={[styles.repsInput, c.inset, { color: c.text }]}
          placeholder="e.g. 10-12"
          placeholderTextColor={c.muted}
          accessibilityLabel="Reps"
        />
      </View>
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
  content: { padding: 20, paddingBottom: 110, gap: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  kicker: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  title: { fontSize: 28, fontWeight: '700' },
  titleInput: { borderBottomWidth: 1, paddingVertical: 2 },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, height: 34, borderRadius: 17 },
  topLine: { fontSize: 15, marginTop: -4 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 6 },
  track: { flex: 1, height: 10, borderRadius: 5, overflow: 'hidden', padding: 2 },
  trackFill: { height: 6, borderRadius: 3 },
  count: { fontSize: 13, fontVariant: ['tabular-nums'] },
  xpPop: { position: 'absolute', right: 0, top: -12, fontSize: 12, fontWeight: '700' },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14, borderRadius: 14 },
  bannerText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  card: { borderRadius: 16, padding: 14, gap: 14 },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumb: { width: 44, height: 44, borderRadius: 10, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  thumbImg: { width: 44, height: 44 },
  exName: { fontSize: 16, fontWeight: '600' },
  exReps: { fontSize: 14, marginTop: 2 },
  sets: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  walk: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  walkText: { flex: 1, fontSize: 15, fontWeight: '500' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 16,
    marginTop: 4,
    height: 52,
  },
  iconBtn: { padding: 4 },
  editRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  editLabel: { fontSize: 13, fontWeight: '600' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 10, paddingHorizontal: 10, height: 36 },
  stepVal: { fontSize: 16, fontWeight: '700', minWidth: 14, textAlign: 'center' },
  repsInput: { flex: 1, minWidth: 0, width: 0, borderRadius: 10, height: 36, paddingHorizontal: 10, fontSize: 15 },
});

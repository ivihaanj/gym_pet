import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { EXERCISE_LIST, MUSCLES, WEEKDAY_NAMES, type Muscle } from '../data/plan';
import { useColors } from '../theme';

/** Browse all exercises. With ?weekday=, tapping one opens it with an Add/Replace button. */
export default function Library() {
  const c = useColors();
  const { weekday, replace } = useLocalSearchParams<{ weekday?: string; replace?: string }>();
  const [query, setQuery] = useState('');
  const [muscle, setMuscle] = useState<Muscle | null>(null);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EXERCISE_LIST.filter(
      (e) => (!muscle || e.muscle === muscle) && (!q || e.name.toLowerCase().includes(q) || e.muscle.toLowerCase().includes(q)),
    );
  }, [query, muscle]);

  const title =
    weekday !== undefined ? `${replace ? 'Replace on' : 'Add to'} ${WEEKDAY_NAMES[Number(weekday)]}` : 'Exercises';

  return (
    <>
      <Stack.Screen options={{ title }} />
      <FlatList
        style={{ backgroundColor: c.bg }}
        contentContainerStyle={styles.content}
        data={items}
        keyExtractor={(e) => e.id}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={{ gap: 12, marginBottom: 4 }}>
            <View style={[styles.search, c.inset]}>
              <Ionicons name="search" size={18} color={c.muted} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search exercises"
                placeholderTextColor={c.muted}
                style={{ flex: 1, color: c.text, fontSize: 16 }}
                accessibilityLabel="Search exercises"
              />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, padding: 6 }}>
              {[null, ...MUSCLES].map((m) => {
                const on = muscle === m;
                return (
                  <Pressable
                    key={m ?? 'all'}
                    onPress={() => setMuscle(m)}
                    style={[styles.chip, on ? c.accentRaised : c.raisedSm]}
                  >
                    <Text style={{ color: on ? c.onAccent : c.text, fontWeight: '600' }}>{m ?? 'All'}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            <Text style={{ color: c.muted, fontSize: 13 }}>{items.length} exercises</Text>
          </View>
        }
        renderItem={({ item: e }) => {
          const src = e.gif ?? (e.gifUrl ? { uri: e.gifUrl } : null);
          return (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/exercise/[id]',
                  params: { id: e.id, ...(weekday !== undefined ? { weekday } : {}), ...(replace ? { replace } : {}) },
                })
              }
              style={[styles.row, c.raised]}
              accessibilityRole="button"
              accessibilityLabel={`${e.name}, ${e.muscle}`}
            >
              <View style={[styles.thumb, { backgroundColor: src ? '#fff' : c.bg }]}>
                {src ? (
                  <Image source={src} style={styles.thumb} contentFit="contain" autoplay={false} cachePolicy="disk" />
                ) : (
                  <Ionicons name="barbell-outline" size={22} color={c.muted} />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { color: c.text }]}>{e.name}</Text>
                <Text style={{ color: c.muted, fontSize: 13 }}>
                  {e.muscle} · {e.sets} x {e.reps}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={c.muted} />
            </Pressable>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 46, borderRadius: 12, paddingHorizontal: 12 },
  chip: { paddingHorizontal: 14, height: 34, borderRadius: 17, justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: 14 },
  thumb: { width: 52, height: 52, borderRadius: 10, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: '600' },
});

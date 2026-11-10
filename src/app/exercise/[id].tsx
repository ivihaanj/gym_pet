import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EXERCISES, SAFETY, type Source } from '../../data/plan';
import { useColors, type Colors } from '../../theme';

export default function ExerciseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useColors();
  const ex = EXERCISES[id];

  if (!ex) {
    return (
      <View style={[styles.center, { backgroundColor: c.bg }]}>
        <Text style={{ color: c.muted }}>Exercise not found.</Text>
      </View>
    );
  }

  const source = ex.gif ?? (ex.gifUrl ? { uri: ex.gifUrl } : null);
  const safetySources = dedupe(SAFETY.flatMap((s) => s.sources));

  return (
    <>
      <Stack.Screen options={{ title: ex.name }} />
      <ScrollView style={{ backgroundColor: c.bg }} contentContainerStyle={styles.content}>
        <View style={styles.media}>
          {source ? (
            <Image
              source={source}
              style={styles.gif}
              contentFit="contain"
              cachePolicy="disk"
              autoplay
              transition={200}
              accessibilityLabel={`${ex.name} form animation`}
            />
          ) : (
            <View style={[styles.placeholder, { backgroundColor: c.surface }]}>
              <Ionicons name="barbell-outline" size={40} color={c.muted} />
              <Text style={[styles.placeholderText, { color: c.muted }]}>No verified GIF yet</Text>
            </View>
          )}
        </View>
        {ex.gifCredit ? (
          <Link source={ex.gifCredit} c={c} small prefix="GIF: " />
        ) : null}

        <Text style={[styles.reps, { color: c.text }]}>
          {ex.sets} x {ex.reps}
        </Text>

        <Section title="Form tips" c={c}>
          {ex.tips.map((t, i) => (
            <View key={i} style={styles.tipRow}>
              <Text style={[styles.tipNum, { color: c.accent }]}>{i + 1}</Text>
              <Text style={[styles.tip, { color: c.text }]}>{t}</Text>
            </View>
          ))}
        </Section>

        <Section title="Safety first" c={c} soft>
          {SAFETY.map((s, i) => (
            <View key={i} style={styles.tipRow}>
              <Ionicons name="shield-checkmark-outline" size={16} color={c.accent} style={{ marginTop: 2 }} />
              <Text style={[styles.tip, { color: c.text }]}>{s.text}</Text>
            </View>
          ))}
        </Section>

        <Section title="Sources" c={c}>
          {ex.sources.map((s) => (
            <Link key={s.url} source={s} c={c} />
          ))}
          {safetySources.map((s) => (
            <Link key={s.url} source={s} c={c} />
          ))}
        </Section>
      </ScrollView>
    </>
  );
}

function dedupe(list: Source[]): Source[] {
  const seen = new Set<string>();
  return list.filter((s) => (seen.has(s.url) ? false : (seen.add(s.url), true)));
}

function Section({ title, children, c, soft }: { title: string; children: React.ReactNode; c: Colors; soft?: boolean }) {
  return (
    <View style={[styles.section, { backgroundColor: soft ? c.accentSoft : c.surface }]}>
      <Text style={[styles.sectionTitle, { color: c.muted }]}>{title}</Text>
      {children}
    </View>
  );
}

function Link({ source, c, small, prefix = '' }: { source: Source; c: Colors; small?: boolean; prefix?: string }) {
  return (
    <Pressable
      onPress={() => WebBrowser.openBrowserAsync(source.url).catch(() => {})}
      accessibilityRole="link"
      style={styles.link}
    >
      <Ionicons name="open-outline" size={small ? 12 : 14} color={c.accent} />
      <Text style={[{ color: c.accent, fontSize: small ? 12 : 14, flex: 1 }]}>
        {prefix}
        {source.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20, gap: 16, paddingBottom: 48 },
  media: { borderRadius: 20, overflow: 'hidden', backgroundColor: '#FFFFFF' },
  gif: { width: '100%', aspectRatio: 1.1 },
  placeholder: { width: '100%', aspectRatio: 1.1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  placeholderText: { fontSize: 14 },
  reps: { fontSize: 32, fontWeight: '700', marginTop: 4 },
  section: { borderRadius: 16, padding: 16, gap: 10 },
  sectionTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  tipRow: { flexDirection: 'row', gap: 10 },
  tipNum: { fontSize: 15, fontWeight: '700', width: 14 },
  tip: { flex: 1, fontSize: 15, lineHeight: 21 },
  link: { flexDirection: 'row', gap: 6, alignItems: 'center' },
});

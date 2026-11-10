import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LevelCard } from '../../components/Game';
import { LEVELS, XP } from '../../data/plan';
import { useStore } from '../../lib/store';
import { useColors, type Colors } from '../../theme';

export default function MeScreen() {
  const c = useColors();
  const { data, game } = useStore();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.top}>
          <View style={[styles.avatar, c.raised]}>
            <Image source={require('../../../assets/mascot.png')} style={{ width: 40, height: 40 }} contentFit="contain" />
          </View>
          <Text style={[styles.name, { color: c.text }]} numberOfLines={1}>
            {data.name}
          </Text>
          <Pressable onPress={() => router.push('/settings')} hitSlop={10} accessibilityLabel="Settings">
            <Ionicons name="settings-outline" size={24} color={c.text} />
          </Pressable>
        </View>

        <LevelCard />

        <View style={styles.stats}>
          <Stat icon="flame" color="#F97316" value={game.streak} label="Streak" c={c} />
          <Stat icon="ribbon-outline" color={c.accent} value={game.bestStreak} label="Best" c={c} />
          <Stat icon="barbell-outline" color={c.green} value={game.workoutsDone} label="Workouts" c={c} />
        </View>

        <Text style={[styles.section, { color: c.muted }]}>How to earn XP</Text>
        <View style={[styles.box, c.raised]}>
          <Row text="Tick a set or the walk" xp={`+${XP.perTick}`} c={c} />
          <Row text="Finish a whole day" xp={`+${XP.dayComplete}`} c={c} />
          <Row text="Streak bonus per day in a row" xp={`+${XP.streakBonusPerDay} each`} c={c} />
        </View>

        <Text style={[styles.section, { color: c.muted }]}>Road to Mr. Olympia</Text>
        <View style={[styles.box, c.raised, { gap: 0, paddingVertical: 6 }]}>
          {LEVELS.map((l, i) => {
            const reached = i <= game.level;
            const current = i === game.level;
            return (
              <View key={l.title} style={styles.ladderRow}>
                <View
                  style={[
                    styles.ladderDot,
                    { backgroundColor: reached ? c.accent : 'transparent', borderColor: reached ? c.accent : c.border },
                  ]}
                >
                  {reached ? <Ionicons name="checkmark" size={12} color={c.onAccent} /> : null}
                </View>
                <Text
                  style={[
                    styles.ladderTitle,
                    { color: reached ? c.text : c.muted, fontWeight: current ? '800' : '500' },
                  ]}
                >
                  {i + 1}. {l.title}
                </Text>
                {reached ? null : <Ionicons name="lock-closed" size={13} color={c.muted} />}
                <Text style={[styles.ladderXp, { color: c.muted }]}>{l.xp.toLocaleString()} XP</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ icon, color, value, label, c }: { icon: keyof typeof Ionicons.glyphMap; color: string; value: number; label: string; c: Colors }) {
  return (
    <View style={[styles.stat, c.raised]}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={[styles.statValue, { color: c.text }]}>{value}</Text>
      <Text style={{ color: c.muted, fontSize: 13 }}>{label}</Text>
    </View>
  );
}

function Row({ text, xp, c }: { text: string; xp: string; c: Colors }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={{ color: c.text, fontSize: 15 }}>{text}</Text>
      <Text style={{ color: c.accent, fontWeight: '700' }}>{xp}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 14, paddingBottom: 40 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  initial: { fontSize: 22, fontWeight: '800' },
  name: { flex: 1, fontSize: 24, fontWeight: '700' },
  stats: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, borderRadius: 16, paddingVertical: 14, alignItems: 'center', gap: 2 },
  statValue: { fontSize: 24, fontWeight: '700', fontVariant: ['tabular-nums'] },
  section: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 6 },
  box: { borderRadius: 16, padding: 16, gap: 10 },
  ladderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  ladderDot: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  ladderTitle: { flex: 1, fontSize: 15 },
  ladderXp: { fontSize: 12, fontVariant: ['tabular-nums'], minWidth: 70, textAlign: 'right' },
});

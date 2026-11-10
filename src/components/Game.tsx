import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { LEVELS } from '../data/plan';
import { useStore } from '../lib/store';
import { useColors } from '../theme';

/** "Hi, Name" with streak and level chips. */
export function GameHeader() {
  const c = useColors();
  const { data, game } = useStore();
  return (
    <View style={styles.header}>
      <Text style={[styles.hi, { color: c.text }]} numberOfLines={1}>
        Hi, {data.name ?? 'there'}
      </Text>
      <View style={styles.chips}>
        <Pressable
          onPress={() => router.navigate('/me')}
          style={[styles.chip, c.raisedSm]}
          accessibilityLabel={`${game.streak} day streak`}
        >
          <Ionicons name="flame" size={15} color={game.streak > 0 ? '#F97316' : c.muted} />
          <Text style={[styles.chipText, { color: c.text }]}>{game.streak}</Text>
        </Pressable>
        <Pressable
          onPress={() => router.navigate('/me')}
          style={[styles.chip, c.raisedSm]}
          accessibilityLabel={`Level ${game.level + 1}, ${game.levelTitle}`}
        >
          <Ionicons name="trophy" size={14} color={c.accent} />
          <Text style={[styles.chipText, { color: c.accent }]}>Lv {game.level + 1}</Text>
        </Pressable>
      </View>
    </View>
  );
}

/** Level card with XP bar. */
export function LevelCard() {
  const c = useColors();
  const { game } = useStore();
  const fill = useRef(new Animated.Value(0)).current;
  const pct = game.levelSpan ? game.intoLevel / game.levelSpan : 1;
  useEffect(() => {
    Animated.timing(fill, { toValue: pct, duration: 600, useNativeDriver: false }).start();
  }, [pct, fill]);
  return (
    <View style={[styles.card, c.accentRaised, { backgroundColor: '#5B5BD6' }]}>
      <Text style={styles.cardKicker}>Level {game.level + 1} of {LEVELS.length}</Text>
      <Text style={styles.cardTitle}>{game.levelTitle}</Text>
      <View style={styles.cardTrack}>
        <Animated.View
          style={[styles.cardFill, { width: fill.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]}
        />
      </View>
      <Text style={styles.cardSub}>
        {game.nextTitle
          ? `${game.intoLevel} / ${game.levelSpan} XP to ${game.nextTitle}`
          : `${game.xp} XP · Top level reached`}
      </Text>
    </View>
  );
}

/** Pops up once each time a new level is reached. */
export function LevelUpModal() {
  const c = useColors();
  const { game, data, markLevelSeen, ready } = useStore();
  const show = ready && data.name !== null && game.level > data.lastSeenLevel;
  const scale = useRef(new Animated.Value(0.8)).current;
  useEffect(() => {
    if (show) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      scale.setValue(0.8);
      Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
    }
  }, [show, scale]);
  return (
    <Modal visible={show} transparent animationType="fade" onRequestClose={markLevelSeen}>
      <View style={styles.backdrop}>
        <Animated.View style={[styles.modal, { backgroundColor: c.bg, transform: [{ scale }] }]}>
          <View style={[styles.trophy, c.raised]}>
            <Image source={require('../../assets/mascot.png')} style={{ width: 64, height: 64 }} contentFit="contain" />
          </View>
          <Text style={[styles.modalKicker, { color: c.accent }]}>Level up!</Text>
          <Text style={[styles.modalTitle, { color: c.text }]}>{game.levelTitle}</Text>
          <Text style={{ color: c.muted, textAlign: 'center' }}>
            {game.nextTitle ? `Next: ${game.nextTitle}` : 'You reached the top!'}
          </Text>
          <Pressable onPress={markLevelSeen} style={[styles.modalBtn, c.accentRaised]}>
            <Text style={{ color: c.onAccent, fontWeight: '700', fontSize: 16 }}>Nice!</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  hi: { fontSize: 17, fontWeight: '600', flex: 1 },
  chips: { flexDirection: 'row', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, height: 30, borderRadius: 15 },
  chipText: { fontSize: 14, fontWeight: '700', fontVariant: ['tabular-nums'] },
  card: { borderRadius: 20, padding: 20, gap: 6 },
  cardKicker: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' },
  cardTitle: { color: '#fff', fontSize: 26, fontWeight: '800' },
  cardTrack: { height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.25)', overflow: 'hidden', marginTop: 8 },
  cardFill: { height: 8, borderRadius: 4, backgroundColor: '#fff' },
  cardSub: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 4 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: 32 },
  modal: { width: '100%', maxWidth: 360, borderRadius: 24, padding: 24, alignItems: 'center', gap: 8 },
  trophy: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  modalKicker: { fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  modalTitle: { fontSize: 26, fontWeight: '800', textAlign: 'center' },
  modalBtn: { marginTop: 12, height: 48, borderRadius: 24, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' },
});

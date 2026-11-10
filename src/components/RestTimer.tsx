import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, Vibration } from 'react-native';
import { REST_SECONDS } from '../data/plan';
import { useColors } from '../theme';

/** Small floating 60-second rest timer. Tap to start, tap again to stop. */
export function RestTimer() {
  const c = useColors();
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [left, setLeft] = useState(REST_SECONDS);
  const fill = useState(() => new Animated.Value(0))[0];

  useEffect(() => {
    if (endsAt === null) return;
    const tick = () => {
      const s = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setLeft(s);
      if (s === 0) {
        setEndsAt(null);
        Vibration.vibrate([0, 300, 150, 300]);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      }
    };
    tick();
    const t = setInterval(tick, 250);
    return () => clearInterval(t);
  }, [endsAt]);

  const running = endsAt !== null;

  const toggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (running) {
      setEndsAt(null);
      setLeft(REST_SECONDS);
      fill.stopAnimation();
      fill.setValue(0);
      return;
    }
    setLeft(REST_SECONDS);
    setEndsAt(Date.now() + REST_SECONDS * 1000);
    fill.setValue(0);
    Animated.timing(fill, {
      toValue: 1,
      duration: REST_SECONDS * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => fill.setValue(0));
  };

  const width = fill.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <Pressable
      onPress={toggle}
      style={[styles.pill, running ? c.accentRaised : c.raised]}
      accessibilityRole="button"
      accessibilityLabel={running ? `Rest timer, ${left} seconds left. Tap to stop.` : 'Start 60 second rest timer'}
    >
      <Animated.View style={[styles.fill, { width, backgroundColor: 'rgba(255,255,255,0.18)' }]} />
      <Ionicons name={running ? 'stop' : 'timer-outline'} size={16} color={running ? c.onAccent : c.accent} />
      <Text style={[styles.text, { color: running ? c.onAccent : c.accent }]}>{running ? `${left}s` : '60s'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0 },
  text: { fontSize: 15, fontWeight: '700', fontVariant: ['tabular-nums'], minWidth: 30 },
});

import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { useColors } from '../theme';

type Props = {
  checked: boolean;
  onPress: () => void;
  label?: string;
  size?: number;
  accessibilityLabel: string;
};

export function CheckBox({ checked, onPress, label, size = 34, accessibilityLabel }: Props) {
  const c = useColors();
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.85, duration: 70, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  }, [checked, scale]);

  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      hitSlop={6}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={accessibilityLabel}
    >
      <Animated.View
        style={[
          styles.box,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: checked ? c.accent : c.border,
            backgroundColor: checked ? c.accent : 'transparent',
            transform: [{ scale }],
          },
        ]}
      >
        {checked ? (
          <Ionicons name="checkmark" size={size * 0.55} color={c.onAccent} />
        ) : label ? (
          <Text style={[styles.label, { color: c.muted }]}>{label}</Text>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: { borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 13, fontWeight: '600' },
});

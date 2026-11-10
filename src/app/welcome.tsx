import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SchedulePicker, TimePicker } from '../components/SchedulePicker';
import { useStore } from '../lib/store';
import { useColors } from '../theme';

const STEPS = ['name', 'days', 'time'] as const;

export default function Welcome() {
  const c = useColors();
  const store = useStore();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(store.data.name ?? '');
  const canNext = step !== 0 || name.trim().length > 0;

  const next = () => {
    if (!canNext) return;
    if (step < STEPS.length - 1) setStep(step + 1);
    else {
      store.setName(name);
      router.replace('/');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.dots}>
            {STEPS.map((s, i) => (
              <View key={s} style={[styles.dot, { backgroundColor: i <= step ? c.accent : c.border }]} />
            ))}
          </View>

          {step === 0 ? (
            <>
              <View style={[styles.logo, c.raised]}>
                <Image source={require('../../assets/mascot.png')} style={{ width: 70, height: 70 }} contentFit="contain" />
              </View>
              <Text style={[styles.title, { color: c.text }]}>Welcome to Gym Pet</Text>
              <Text style={[styles.sub, { color: c.muted }]}>What should we call you?</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={c.muted}
                autoFocus
                maxLength={24}
                returnKeyType="next"
                onSubmitEditing={next}
                style={[styles.input, c.inset, { color: c.text }]}
                accessibilityLabel="Your name"
              />
            </>
          ) : step === 1 ? (
            <>
              <Text style={[styles.title, { color: c.text }]}>Pick your days</Text>
              <Text style={[styles.sub, { color: c.muted }]}>You can change this later.</Text>
              <SchedulePicker />
            </>
          ) : (
            <>
              <Text style={[styles.title, { color: c.text }]}>Workout time</Text>
              <Text style={[styles.sub, { color: c.muted }]}>Get a reminder on workout days.</Text>
              <TimePicker />
            </>
          )}
        </ScrollView>

        <View style={styles.footer}>
          {step > 0 ? (
            <Pressable onPress={() => setStep(step - 1)} style={[styles.back, c.raisedSm]} accessibilityLabel="Back">
              <Ionicons name="arrow-back" size={20} color={c.text} />
            </Pressable>
          ) : null}
          <Pressable
            onPress={next}
            disabled={!canNext}
            style={[styles.next, c.accentRaised, { opacity: canNext ? 1 : 0.4 }]}
            accessibilityRole="button"
          >
            <Text style={{ color: c.onAccent, fontSize: 16, fontWeight: '700' }}>
              {step === STEPS.length - 1 ? "Let's go" : 'Next'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, gap: 14, paddingBottom: 40 },
  dots: { flexDirection: 'row', gap: 6, marginBottom: 16 },
  dot: { flex: 1, height: 4, borderRadius: 2 },
  logo: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  title: { fontSize: 28, fontWeight: '800' },
  sub: { fontSize: 16, marginTop: -6, marginBottom: 6 },
  input: { height: 54, borderRadius: 14, paddingHorizontal: 16, fontSize: 18 },
  footer: { flexDirection: 'row', gap: 10, padding: 20 },
  back: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  next: { flex: 1, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
});

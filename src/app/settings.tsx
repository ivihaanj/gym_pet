import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SchedulePicker, TimePicker } from '../components/SchedulePicker';
import { useStore } from '../lib/store';
import { useColors } from '../theme';

export default function Settings() {
  const c = useColors();
  const store = useStore();
  const [name, setName] = useState(store.data.name ?? '');

  const confirmReset = () => {
    const doReset = () => {
      store.resetAll();
      router.replace('/welcome');
    };
    if (Platform.OS === 'web') {
      if (globalThis.confirm?.('Delete all progress and start over?')) doReset();
      return;
    }
    Alert.alert('Start over?', 'This deletes all progress on this phone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: doReset },
    ]);
  };

  return (
    <ScrollView style={{ backgroundColor: c.bg }} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={[styles.section, { color: c.muted }]}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        onEndEditing={() => name.trim() && store.setName(name)}
        onBlur={() => name.trim() && store.setName(name)}
        maxLength={24}
        style={[styles.input, c.inset, { color: c.text }]}
        accessibilityLabel="Your name"
      />

      <Text style={[styles.section, { color: c.muted }]}>Schedule</Text>
      <SchedulePicker />

      <Text style={[styles.section, { color: c.muted }]}>Workout time</Text>
      <TimePicker />

      <Text style={[styles.section, { color: c.muted }]}>Data</Text>
      <View style={[styles.box, c.raised]}>
        <Text style={{ color: c.muted, fontSize: 14 }}>Everything is saved only on this phone.</Text>
        <Pressable onPress={confirmReset} accessibilityRole="button">
          <Text style={{ color: c.red, fontWeight: '600', fontSize: 15 }}>Delete all progress</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 12, paddingBottom: 48 },
  section: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 10 },
  input: { height: 50, borderRadius: 14, paddingHorizontal: 16, fontSize: 17 },
  box: { borderRadius: 14, padding: 16, gap: 12 },
});

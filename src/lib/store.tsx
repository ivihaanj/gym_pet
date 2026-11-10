import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { checklistIds } from '../data/plan';
import { addDays, dateKey, parseKey, startOfToday, workoutFor } from './dates';

const KEY = 'gympet:v1';

type Data = {
  /** First day the app was opened. Workout days before this never count as missed. */
  firstUse: string;
  /** Ticked items per date, e.g. { "2026-11-09": ["db-bench-press#1", "walk"] }. Kept forever as history. */
  checks: Record<string, string[]>;
};

export type DayStatus = 'rest' | 'complete' | 'partial' | 'missed' | 'open';

type Store = {
  ready: boolean;
  isChecked: (date: string, id: string) => boolean;
  toggle: (date: string, id: string) => void;
  progress: (date: string) => { done: number; total: number };
  status: (date: Date) => DayStatus;
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Data>({ firstUse: dateKey(startOfToday()), checks: {} });
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Data;
          setData({ firstUse: parsed.firstUse ?? dateKey(startOfToday()), checks: parsed.checks ?? {} });
        }
      } catch {
        // Bad or missing data: start fresh.
      }
      loaded.current = true;
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    AsyncStorage.setItem(KEY, JSON.stringify(data)).catch(() => {});
  }, [data]);

  const toggle = useCallback((date: string, id: string) => {
    setData((prev) => {
      const cur = prev.checks[date] ?? [];
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      return { ...prev, checks: { ...prev.checks, [date]: next } };
    });
  }, []);

  const store = useMemo<Store>(() => {
    const progress = (date: string) => {
      const day = workoutFor(parseKey(date));
      if (!day) return { done: 0, total: 0 };
      const ids = checklistIds(day);
      const ticked = new Set(data.checks[date] ?? []);
      return { done: ids.filter((i) => ticked.has(i)).length, total: ids.length };
    };
    const status = (d: Date): DayStatus => {
      if (!workoutFor(d)) return 'rest';
      const key = dateKey(d);
      const { done, total } = progress(key);
      if (done === total) return 'complete';
      if (done > 0) return 'partial';
      const today = dateKey(startOfToday());
      if (key < today && key >= data.firstUse) return 'missed';
      return 'open';
    };
    return {
      ready,
      isChecked: (date, id) => (data.checks[date] ?? []).includes(id),
      toggle,
      progress,
      status,
    };
  }, [data, ready, toggle]);

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore must be inside StoreProvider');
  return s;
}

/** Completed workout days in a row. Today does not break the streak until it has passed. */
export function currentStreak(status: Store['status']): number {
  let d = startOfToday();
  let streak = 0;
  if (workoutFor(d) && status(d) !== 'complete') d = addDays(d, -1);
  for (let i = 0; i < 800; i++) {
    const s = status(d);
    if (s === 'complete') streak++;
    else if (s !== 'rest') break;
    d = addDays(d, -1);
  }
  return streak;
}

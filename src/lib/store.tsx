import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  checklistIds,
  DEFAULT_PRESET,
  EXERCISES,
  LEVELS,
  PRESETS,
  XP,
  cardioCore,
  type DayPlan,
  type Plan,
  type PlanItem,
} from '../data/plan';
import { addDays, dateKey, mondayOf, parseKey, startOfToday } from './dates';
import { syncReminders } from './reminders';

const KEY_V2 = 'gympet:v2';
const KEY_V1 = 'gympet:v1';

export type Reminder = { enabled: boolean; hour: number; minute: number };

type Log = { done: string[]; total: number };

export type Data = {
  version: 2;
  name: string | null;
  firstUse: string;
  presetId: string;
  plan: Plan;
  reminder: Reminder;
  /** Which weekdays were workout days from a date on. Keeps old history correct after schedule changes. */
  scheduleHistory: { from: string; weekdays: number[] }[];
  logs: Record<string, Log>;
  lastSeenLevel: number;
};

export type DayStatus = 'rest' | 'complete' | 'partial' | 'missed' | 'open';

const clonePlan = (p: Plan): Plan => JSON.parse(JSON.stringify(p));
const weekdaysOf = (p: Plan) => Object.keys(p).map(Number).sort();

function freshData(): Data {
  const today = dateKey(startOfToday());
  return {
    version: 2,
    name: null,
    firstUse: today,
    presetId: DEFAULT_PRESET.id,
    plan: clonePlan(DEFAULT_PRESET.plan),
    reminder: { enabled: false, hour: 17, minute: 0 },
    scheduleHistory: [{ from: today, weekdays: weekdaysOf(DEFAULT_PRESET.plan) }],
    logs: {},
    lastSeenLevel: 0,
  };
}

/** v1 stored { firstUse, checks: { date: ids[] } } with the original plan. Item ids match (uid = exercise id). */
function migrateV1(raw: string): Data {
  const v1 = JSON.parse(raw) as { firstUse?: string; checks?: Record<string, string[]> };
  const d = freshData();
  if (v1.firstUse) {
    d.firstUse = v1.firstUse;
    d.scheduleHistory = [{ from: v1.firstUse, weekdays: weekdaysOf(DEFAULT_PRESET.plan) }];
  }
  for (const [date, done] of Object.entries(v1.checks ?? {})) {
    const day = DEFAULT_PRESET.plan[parseKey(date).getDay()];
    d.logs[date] = { done, total: checklistIds(day).length };
  }
  return d;
}

let uidCounter = 0;
const newUid = () => `u${Date.now().toString(36)}${(uidCounter++).toString(36)}`;

type Store = {
  ready: boolean;
  data: Data;
  // profile
  setName: (name: string) => void;
  // checklist
  isChecked: (date: string, id: string) => boolean;
  toggle: (date: string, id: string) => void;
  progress: (date: string) => { done: number; total: number };
  status: (date: Date) => DayStatus;
  dayPlanFor: (date: Date) => DayPlan | undefined;
  // plan editing
  applyPreset: (presetId: string) => void;
  setWorkoutDays: (weekdays: number[]) => void;
  setDayTitle: (weekday: number, title: string) => void;
  addExercise: (weekday: number, exerciseId: string) => void;
  replaceExercise: (weekday: number, uid: string, exerciseId: string) => void;
  removeItem: (weekday: number, uid: string) => void;
  moveItem: (weekday: number, uid: string, dir: -1 | 1) => void;
  updateItem: (weekday: number, uid: string, patch: Partial<Pick<PlanItem, 'sets' | 'reps'>>) => void;
  setReminder: (r: Reminder) => void;
  // game
  game: Game;
  markLevelSeen: () => void;
  resetAll: () => void;
};

export type Game = {
  xp: number;
  level: number; // index into LEVELS
  levelTitle: string;
  nextTitle: string | null;
  intoLevel: number; // xp gained inside this level
  levelSpan: number; // xp needed for this level (0 at max)
  streak: number;
  bestStreak: number;
  workoutsDone: number;
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Data>(freshData);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY_V2);
        if (raw) {
          setData({ ...freshData(), ...(JSON.parse(raw) as Data) });
        } else {
          const old = await AsyncStorage.getItem(KEY_V1);
          if (old) setData(migrateV1(old));
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
    AsyncStorage.setItem(KEY_V2, JSON.stringify(data)).catch(() => {});
  }, [data]);

  // Keep phone reminders in sync with the schedule and time.
  const reminderKey = JSON.stringify([data.reminder, weekdaysOf(data.plan), data.name]);
  useEffect(() => {
    if (!loaded.current) return;
    syncReminders(data.reminder, weekdaysOf(data.plan), data.name).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reminderKey]);

  const today = startOfToday();
  const todayKey = dateKey(today);
  const thisMonday = dateKey(mondayOf(today));

  const update = useCallback((fn: (d: Data) => Data) => setData((prev) => fn(prev)), []);

  const editPlan = useCallback(
    (weekday: number, fn: (day: DayPlan) => DayPlan) =>
      update((d) => {
        const day = d.plan[weekday];
        if (!day) return d;
        return { ...d, presetId: 'custom', plan: { ...d.plan, [weekday]: fn({ ...day, items: [...day.items] }) } };
      }),
    [update],
  );

  /** Record which weekdays are workout days from today on. */
  const withSchedule = (d: Data, plan: Plan): Data => {
    const weekdays = weekdaysOf(plan);
    const hist = d.scheduleHistory.filter((h) => h.from < todayKey);
    return { ...d, plan, scheduleHistory: [...hist, { from: todayKey, weekdays }] };
  };

  const store = useMemo<Store>(() => {
    const weekdaysAt = (key: string): number[] => {
      let found = data.scheduleHistory[0]?.weekdays ?? [];
      for (const h of data.scheduleHistory) if (h.from <= key) found = h.weekdays;
      return found;
    };

    const liveIds = (d: Date) => checklistIds(data.plan[d.getDay()]);

    const progress = (key: string) => {
      const d = parseKey(key);
      const log = data.logs[key];
      if (key >= thisMonday) {
        const ids = liveIds(d);
        const ticked = new Set(log?.done ?? []);
        return { done: ids.filter((i) => ticked.has(i)).length, total: ids.length };
      }
      return { done: Math.min(log?.done.length ?? 0, log?.total ?? 0), total: log?.total ?? 0 };
    };

    const status = (d: Date): DayStatus => {
      const key = dateKey(d);
      const scheduled = key >= thisMonday ? data.plan[d.getDay()] !== undefined : weekdaysAt(key).includes(d.getDay());
      const { done, total } = progress(key);
      if (total > 0 && done >= total) return 'complete';
      if (!scheduled) return 'rest';
      if (done > 0) return 'partial';
      if (key < todayKey && key >= data.firstUse) return 'missed';
      return 'open';
    };

    // ----- game -----
    let xp = 0;
    let workoutsDone = 0;
    let run = 0;
    let bestStreak = 0;
    const start = parseKey(data.firstUse);
    for (let d = start, i = 0; dateKey(d) <= todayKey && i < 3000; d = addDays(d, 1), i++) {
      const key = dateKey(d);
      const { done } = progress(key);
      xp += done * XP.perTick;
      const s = status(d);
      if (s === 'complete') {
        workoutsDone++;
        run++;
        bestStreak = Math.max(bestStreak, run);
        xp += XP.dayComplete + Math.min(run, XP.streakBonusCap) * XP.streakBonusPerDay;
      } else if (s === 'missed' || (s === 'partial' && key < todayKey)) {
        run = 0;
      }
    }
    // Current streak: today does not break it until it has passed.
    let streak = 0;
    {
      let d = today;
      if (status(d) !== 'complete') d = addDays(d, -1);
      for (let i = 0; i < 3000 && dateKey(d) >= data.firstUse; i++, d = addDays(d, -1)) {
        const s = status(d);
        if (s === 'complete') streak++;
        else if (s !== 'rest') break;
      }
    }
    let level = 0;
    while (level + 1 < LEVELS.length && xp >= LEVELS[level + 1].xp) level++;
    const next = LEVELS[level + 1];
    const game: Game = {
      xp,
      level,
      levelTitle: LEVELS[level].title,
      nextTitle: next?.title ?? null,
      intoLevel: xp - LEVELS[level].xp,
      levelSpan: next ? next.xp - LEVELS[level].xp : 0,
      streak,
      bestStreak: Math.max(bestStreak, streak),
      workoutsDone,
    };

    return {
      ready,
      data,
      game,
      setName: (name) => update((d) => ({ ...d, name: name.trim() || null })),
      isChecked: (date, id) => (data.logs[date]?.done ?? []).includes(id),
      toggle: (date, id) =>
        update((d) => {
          const log = d.logs[date] ?? { done: [], total: 0 };
          const done = log.done.includes(id) ? log.done.filter((x) => x !== id) : [...log.done, id];
          const total = checklistIds(d.plan[parseKey(date).getDay()]).length;
          return { ...d, logs: { ...d.logs, [date]: { done, total } } };
        }),
      progress,
      status,
      dayPlanFor: (d) => data.plan[d.getDay()],
      applyPreset: (presetId) =>
        update((d) => {
          const p = PRESETS.find((x) => x.id === presetId);
          if (!p) return d;
          return { ...withSchedule(d, clonePlan(p.plan)), presetId };
        }),
      setWorkoutDays: (weekdays) =>
        update((d) => {
          const plan: Plan = {};
          for (const w of weekdays) {
            plan[w] = d.plan[w] ?? DEFAULT_PRESET.plan[w] ?? cardioCore(`${w}-${Date.now().toString(36)}-`);
          }
          return { ...withSchedule(d, clonePlan(plan)), presetId: 'custom' };
        }),
      setDayTitle: (w, title) => editPlan(w, (day) => ({ ...day, title })),
      addExercise: (w, exerciseId) =>
        editPlan(w, (day) => {
          const ex = EXERCISES[exerciseId];
          return { ...day, items: [...day.items, { uid: newUid(), exerciseId, sets: ex.sets, reps: ex.reps }] };
        }),
      replaceExercise: (w, uid, exerciseId) =>
        editPlan(w, (day) => ({
          ...day,
          items: day.items.map((i) =>
            i.uid === uid ? { uid: newUid(), exerciseId, sets: EXERCISES[exerciseId].sets, reps: EXERCISES[exerciseId].reps } : i,
          ),
        })),
      removeItem: (w, uid) => editPlan(w, (day) => ({ ...day, items: day.items.filter((i) => i.uid !== uid) })),
      moveItem: (w, uid, dir) =>
        editPlan(w, (day) => {
          const i = day.items.findIndex((x) => x.uid === uid);
          const j = i + dir;
          if (i < 0 || j < 0 || j >= day.items.length) return day;
          const items = [...day.items];
          [items[i], items[j]] = [items[j], items[i]];
          return { ...day, items };
        }),
      updateItem: (w, uid, patch) =>
        editPlan(w, (day) => ({ ...day, items: day.items.map((i) => (i.uid === uid ? { ...i, ...patch } : i)) })),
      setReminder: (reminder) => update((d) => ({ ...d, reminder })),
      markLevelSeen: () => update((d) => ({ ...d, lastSeenLevel: game.level })),
      resetAll: () => setData(freshData()),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, ready, update, editPlan, todayKey, thisMonday]);

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore must be inside StoreProvider');
  return s;
}

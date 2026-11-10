import { DAYS, dayForWeekday, type WorkoutDay } from '../data/plan';

/** Local date as "YYYY-MM-DD". */
export function dateKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function parseKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() + n);
  return x;
}

export function startOfToday(): Date {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

/** Monday of the week (weeks run Monday to Sunday). */
export function mondayOf(d: Date): Date {
  return addDays(d, -((d.getDay() + 6) % 7));
}

/** This week's date for a weekday. A new week gives new dates, so the checklist starts empty. */
export function dateInThisWeek(weekday: number, today = startOfToday()): Date {
  const offset = (weekday + 6) % 7; // Mon=0 ... Sun=6
  return addDays(mondayOf(today), offset);
}

export function workoutFor(d: Date): WorkoutDay | undefined {
  return dayForWeekday(d.getDay());
}

/** Next workout day after `from` (not including it). */
export function nextWorkout(from: Date): { date: Date; day: WorkoutDay } {
  for (let i = 1; i <= 7; i++) {
    const d = addDays(from, i);
    const day = workoutFor(d);
    if (day) return { date: d, day };
  }
  return { date: from, day: DAYS[0] };
}

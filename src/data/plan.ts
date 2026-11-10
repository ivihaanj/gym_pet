/**
 * ALL workout data lives in this one file so it is easy to check and edit.
 *
 * - Exercises, sets and reps come straight from the plan. Do not change them here
 *   unless the plan itself changes.
 * - `gif` is a bundled file in assets/exercises (works offline from install).
 *   You can instead set `gifUrl` to a remote GIF; it is cached on the phone
 *   after the first load (expo-image disk cache).
 * - `gif: null` and no `gifUrl` shows a clean placeholder.
 * - Every tip is based on the linked source(s).
 */

export type Source = { label: string; url: string };

export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: string;
  gif: number | null; // require('...gif') or null
  gifUrl?: string; // optional remote GIF (cached to disk after first load)
  gifCredit?: Source; // license / attribution for the GIF
  tips: string[]; // 3-5 short tips
  sources: Source[];
};

export type WorkoutDay = {
  weekday: 0 | 1 | 3 | 5; // JS getDay(): 0 = Sunday, 1 = Monday ...
  short: string;
  name: string;
  title: string;
  exerciseIds: string[];
};

export const TOP_LINE = 'Warm up 5 min. Rest 60 sec between sets.';

export const WALK = {
  id: 'walk',
  label: '15 min incline walk (6-10% slope, 4.5-5.5 km/h)',
};

export const REST_SECONDS = 60;

// ---------- Sources ----------
const ace = (n: number, slug: string, label: string): Source => ({
  label: `ACE – ${label}`,
  url: `https://www.acefitness.org/resources/everyone/exercise-library/${n}/${slug}/`,
});

const S = {
  chestPress: ace(19, 'chest-press', 'Chest Press'),
  overheadPress: ace(45, 'seated-overhead-press', 'Seated Overhead Press'),
  inclinePress: ace(25, 'incline-chest-press', 'Incline Chest Press'),
  lateralRaise: ace(26, 'lateral-raise', 'Lateral Raise'),
  pressdown: ace(333, 'tricep-pressdown', 'Tricep Pressdown'),
  pushdowns: ace(185, 'triceps-pushdowns', 'Triceps Pushdowns'),
  chestFly: ace(21, 'lying-chest-fly', 'Lying Chest Fly'),
  seatedChestPress: ace(188, 'seated-chest-press', 'Seated Chest Press'),
  gobletSquat: ace(362, 'goblet-squat', 'Goblet Squat'),
  legPress: ace(154, 'seated-leg-press', 'Seated Leg Press'),
  lyingCurl: ace(153, 'lying-hamstrings-curl', 'Lying Hamstrings Curl'),
  lunge: ace(94, 'forward-lunge', 'Forward Lunge'),
  calfRaise: ace(73, 'standing-calf-raises-wall', 'Standing Calf Raises'),
  latPulldown: ace(158, 'seated-lat-pulldown', 'Seated Lat Pulldown'),
  seatedRow: ace(48, 'seated-row', 'Seated Row'),
  singleArmRow: ace(126, 'single-arm-row', 'Single-arm Row'),
  facePull: {
    label: 'NSCA – Face Pull (Machine)',
    url: 'https://www.nsca.com/education/articles/kinetic-select/face-pull-machine/',
  },
  bicepCurl: ace(70, 'bicep-curl', 'Bicep Curl'),
  hammerCurl: ace(10, 'hammer-curl', 'Hammer Curl'),
  suitcaseCarry: ace(358, 'suitcase-carry', 'Suitcase Carry'),
  farmersCarry: ace(359, 'farmer-s-carry', "Farmer's Carry"),
  squatPress: ace(357, 'squat-to-overhead-press', 'Squat to Overhead Press'),
  seatedCurl: {
    label: 'ACE – Best Exercise for the Hamstrings (seated leg curl)',
    url: 'https://www.acefitness.org/continuing-education/certified/special-research-issue/7228/what-is-the-best-exercise-for-the-hamstrings/',
  },
  nsca: {
    label: 'NSCA – Youth Resistance Training Position Statement',
    url: 'https://www.nsca.com/globalassets/about/position-statements/position_stand_youth_resistance_training---2009.pdf',
  },
  acsm: {
    label: 'ACSM – Youth Resistance Training',
    url: 'https://acsm.org/wp-content/uploads/2025/02/NYSHSI-Youth-Resistance-Training-PDF.pdf',
  },
  nhs: {
    label: 'NHS – Activity guidelines for young people',
    url: 'https://www.nhs.uk/live-well/exercise/physical-activity-guidelines-children-and-young-people/',
  },
  kidsHealth: {
    label: 'KidsHealth (Nemours) – Strength Training for Teens',
    url: 'https://kidshealth.org/en/teens/strength-training.html',
  },
};

/** Shown on every exercise page. Rules for a growing teenager. */
export const SAFETY: { text: string; sources: Source[] }[] = [
  {
    text: 'Use a light to medium weight you can lift 10-15 times with perfect form.',
    sources: [S.nsca, S.acsm],
  },
  { text: 'Never try to lift your max.', sources: [S.acsm, S.kidsHealth] },
  {
    text: 'Perfect form first. Add weight only when every rep looks the same.',
    sources: [S.acsm, S.nsca],
  },
  {
    text: 'Stop if you feel sharp pain or a "pop". Normal muscle burn is OK. Tell an adult.',
    sources: [S.kidsHealth],
  },
  {
    text: 'Ask a trained adult to show you new exercises and watch you lift.',
    sources: [S.nhs],
  },
];

// ---------- GIFs (Everkinetic drawings via Wikimedia Commons, CC BY-SA 3.0) ----------
const commons = (file: string): Source => ({
  label: 'Everkinetic, CC BY-SA 3.0 (start/end frames joined into a loop)',
  url: `https://commons.wikimedia.org/wiki/File:${file.replace(/ /g, '_')}`,
});

// ---------- Exercises ----------
export const EXERCISES: Record<string, Exercise> = {
  // ===== Monday – Push =====
  'db-bench-press': {
    id: 'db-bench-press',
    name: 'Dumbbell bench press',
    sets: 3,
    reps: '10-12',
    gif: require('../../assets/exercises/dumbbell-bench-press.gif'),
    gifCredit: commons('Bench press dumbbell 1.svg'),
    tips: [
      'Lie flat. Head, shoulders, butt and feet stay in contact the whole time.',
      'Lower the weights slowly to your mid-chest. Never bounce them.',
      'Common mistake: arching your lower back. Keep it flat on the bench.',
      'Breathe in as you lower. Breathe out as you push up.',
      'Keep your wrists straight. Have a spotter nearby.',
    ],
    sources: [S.chestPress],
  },
  'db-shoulder-press': {
    id: 'db-shoulder-press',
    name: 'Dumbbell shoulder press',
    sets: 3,
    reps: '10-12',
    gif: require('../../assets/exercises/dumbbell-shoulder-press.gif'),
    gifCredit: commons('Dumbbell-shoulder-press-1.png'),
    tips: [
      'Sit with your back on the backrest and feet flat on the floor.',
      'Tighten your stomach before each rep.',
      'Common mistake: arching your lower back as you press up.',
      'Breathe out as you press up. Breathe in as you lower slowly.',
      'Keep elbows slightly in front of you. It is easier on the shoulders.',
    ],
    sources: [S.overheadPress],
  },
  'incline-db-press': {
    id: 'incline-db-press',
    name: 'Incline dumbbell press',
    sets: 3,
    reps: '10-12',
    gif: require('../../assets/exercises/incline-dumbbell-press.gif'),
    gifCredit: commons('Incline dumbbell press 1.svg'),
    tips: [
      'Set the bench to 45-60 degrees. Feet flat on the floor.',
      'Pull your shoulders down and back into the bench.',
      'Lower slowly to your upper chest. No bouncing.',
      'Common mistake: back lifting off the bench. Keep head, shoulders and butt down.',
      'Breathe in going down. Breathe out going up.',
    ],
    sources: [S.inclinePress],
  },
  'lateral-raises': {
    id: 'lateral-raises',
    name: 'Lateral raises',
    sets: 3,
    reps: '12-15',
    gif: require('../../assets/exercises/lateral-raises.gif'),
    gifCredit: commons('Dumbbell-lateral-raises-1.png'),
    tips: [
      'Stand tall, feet hip-width apart, small bend in your elbows.',
      'Raise the weights out to the sides, only up to shoulder height.',
      'Common mistake: swinging or leaning back. Use a lighter weight instead.',
      'Breathe out going up. Breathe in going down.',
      'Near the top, tilt the front of the weights slightly up. This helps protect your shoulders.',
    ],
    sources: [S.lateralRaise],
  },
  'triceps-pushdown': {
    id: 'triceps-pushdown',
    name: 'Triceps pushdown',
    sets: 3,
    reps: '12',
    gif: require('../../assets/exercises/triceps-pushdown.gif'),
    gifCredit: commons('Triceps-pushdown-1.gif'),
    tips: [
      'Stand tall, knees slightly bent. Cable set at the highest spot.',
      'Keep your elbows tucked at your sides. Only your forearms move.',
      'Common mistake: leaning over to push with your body weight.',
      'Breathe out as you push down. Breathe in as you come up slowly.',
    ],
    sources: [S.pressdown, S.pushdowns],
  },
  'pec-deck': {
    id: 'pec-deck',
    name: 'Pec deck fly machine',
    sets: 3,
    reps: '12-15',
    gif: require('../../assets/exercises/pec-deck.gif'),
    gifCredit: commons('Butterfly-machine-1.png'),
    tips: [
      'Set the seat so the handles are at chest height. Back flat on the pad.',
      'Keep a small bend in your elbows the whole time.',
      'Common mistake: letting your arms go too far back. Stop when hands line up with your chest.',
      'Breathe out as your arms come together. Breathe in as they open.',
      'Move slowly and keep it light. This exercise stresses the shoulders.',
    ],
    sources: [S.chestFly, S.seatedChestPress],
  },

  // ===== Wednesday – Lower =====
  'goblet-squat': {
    id: 'goblet-squat',
    name: 'Goblet squat',
    sets: 3,
    reps: '12',
    gif: null, // no correctly licensed match found
    tips: [
      'Feet about shoulder-width apart. Hold one dumbbell upright at your chest.',
      'Keep your elbows close to your ribs and your back straight.',
      'Go down only as far as your back stays straight. Then push through your feet to stand.',
      'Common mistake: rounding your back. Keep your chest up.',
      'Breathe in going down. Breathe out as you stand up.',
    ],
    sources: [S.gobletSquat, S.acsm],
  },
  'leg-press': {
    id: 'leg-press',
    name: 'Leg press',
    sets: 3,
    reps: '12',
    gif: require('../../assets/exercises/leg-press.gif'),
    gifCredit: commons('Leg-press-1-1024x670.png'),
    tips: [
      'Back and tailbone flat on the seat. Feet flat on the plate.',
      'Start with your knees bent about 90 degrees.',
      'Common mistake: locking your knees at the top. Keep a slight bend.',
      "Don't bring your knees so close that your lower back lifts off the seat.",
      'Breathe out as you push. Breathe in as you lower slowly.',
    ],
    sources: [S.legPress],
  },
  'leg-curl': {
    id: 'leg-curl',
    name: 'Leg curl machine',
    sets: 3,
    reps: '12',
    gif: require('../../assets/exercises/leg-curl-machine.gif'),
    gifCredit: commons('Lying leg curl machine 1.svg'),
    tips: [
      "Line up your knee with the machine's pivot point.",
      'The pad sits on the lower part of your calves, above your heels.',
      'Common mistake: lifting your hips or arching your back. Go lighter if this happens.',
      'Breathe out as you curl. Breathe in as you lower slowly.',
    ],
    sources: [S.lyingCurl],
  },
  'walking-lunges': {
    id: 'walking-lunges',
    name: 'Walking lunges',
    sets: 3,
    reps: '10 each leg',
    gif: require('../../assets/exercises/walking-lunges.gif'),
    gifCredit: commons('Walking-lunges-1.png'),
    tips: [
      'Stand tall, shoulders back, stomach tight.',
      'Step forward and drop your hips straight down, not forward.',
      'Lower until your front thigh is about level with the floor, or less if needed.',
      'Common mistake: wobbling side to side. Take smaller, slower steps.',
      'Breathe in going down. Breathe out as you push up.',
    ],
    sources: [S.lunge],
  },
  'calf-raises': {
    id: 'calf-raises',
    name: 'Calf raises',
    sets: 3,
    reps: '15',
    gif: require('../../assets/exercises/calf-raises.gif'),
    gifCredit: commons('Standing-calf-raises-1.gif'),
    tips: [
      'Stand tall, feet hip-width apart, toes pointing forward.',
      'Rise onto your toes slowly with straight knees. Hold for a moment at the top.',
      'Common mistake: bouncing. Lower your heels slowly.',
      'Breathe out going up. Breathe in going down.',
      'Hold a wall or rail for balance.',
    ],
    sources: [S.calfRaise],
  },

  // ===== Friday – Pull =====
  'lat-pulldown': {
    id: 'lat-pulldown',
    name: 'Lat pulldown',
    sets: 3,
    reps: '10-12',
    gif: require('../../assets/exercises/lat-pulldown.gif'),
    gifCredit: commons('Wide-grip-lat-pull-down-1.gif'),
    tips: [
      'Set the thigh pad so it fits firmly on your thighs.',
      'Lean back only a little. Pull the bar to your upper chest.',
      'Drive your elbows down toward the floor.',
      'Common mistake: leaning far back to move the weight. Go lighter.',
      'Breathe out as you pull down. Breathe in as the bar rises slowly.',
    ],
    sources: [S.latPulldown],
  },
  'seated-cable-row': {
    id: 'seated-cable-row',
    name: 'Seated cable row',
    sets: 3,
    reps: '10-12',
    gif: require('../../assets/exercises/seated-cable-row.gif'),
    gifCredit: commons('Cable-seated-rows-1.png'),
    tips: [
      'Sit with knees slightly bent and back straight.',
      'Lift your chest. Pull your elbows back close to your ribs.',
      'Pull until the handle touches your stomach. Pause for one second.',
      'Common mistake: rounding your back or rocking. Keep your upper body still.',
      'Breathe out as you pull. Breathe in as your arms straighten slowly.',
    ],
    sources: [S.seatedRow],
  },
  'db-row': {
    id: 'db-row',
    name: 'Dumbbell row',
    sets: 3,
    reps: '12',
    gif: null, // no correctly licensed match found
    tips: [
      'One knee and one hand on the bench. Hand under shoulder, knee under hip.',
      'Keep your back flat and your head in line with your spine.',
      'Pull the dumbbell up with your arm close to your side.',
      "Common mistake: twisting your body. Stop when you can't go higher without twisting.",
      'Breathe out as you pull. Breathe in as you lower.',
    ],
    sources: [S.singleArmRow],
  },
  'face-pulls': {
    id: 'face-pulls',
    name: 'Face pulls',
    sets: 3,
    reps: '15',
    gif: null, // no correctly licensed match found
    tips: [
      'Set the cable high. Hold the rope with palms facing down.',
      'Stand with feet even, knees slightly bent, body tall.',
      'Squeeze your shoulder blades back first. Then pull the rope toward your face, elbows out.',
      'Common mistake: leaning back to move the weight. Stay still and go lighter.',
      'Breathe out as you pull. Breathe in as you return slowly.',
    ],
    sources: [S.facePull],
  },
  'db-biceps-curl': {
    id: 'db-biceps-curl',
    name: 'Dumbbell biceps curl',
    sets: 3,
    reps: '12',
    gif: require('../../assets/exercises/dumbbell-biceps-curl.gif'),
    gifCredit: commons('Biceps curl with dumbbell 1.svg'),
    tips: [
      'Stand tall with dumbbells at your sides, palms facing forward.',
      'Keep your elbows by your sides. Only your forearms move.',
      'Common mistake: swinging your body. Keep your chest still.',
      'Breathe out as you curl up. Breathe in as you lower slowly.',
      'Keep your wrists straight.',
    ],
    sources: [S.bicepCurl, S.hammerCurl],
  },
  'suitcase-carry': {
    id: 'suitcase-carry',
    name: 'Suitcase carry',
    sets: 3,
    reps: '30 sec each hand',
    gif: null, // no correctly licensed match found
    tips: [
      'Hold one dumbbell at your side with a firm grip.',
      "Stand tall. Don't lean toward the weight or away from it.",
      'Walk slowly with short, steady steps.',
      "Breathe normally. Don't hold your breath.",
      'Switch hands after 30 seconds. Put the weight down by bending your knees.',
    ],
    sources: [S.suitcaseCarry],
  },

  // ===== Sunday – Full body =====
  'squat-to-press': {
    id: 'squat-to-press',
    name: 'Dumbbell squat to press',
    sets: 3,
    reps: '12',
    gif: null, // no correctly licensed match found
    tips: [
      'Hold dumbbells at your shoulders, palms facing each other, elbows close.',
      'Push your hips back and keep your back straight as you squat.',
      'Stand up and press the weights overhead in one smooth move.',
      'Common mistake: arching your lower back at the top. Tighten your stomach.',
      'Breathe in going down. Breathe out as you stand and press.',
    ],
    sources: [S.squatPress, S.overheadPress],
  },
  'machine-chest-press': {
    id: 'machine-chest-press',
    name: 'Machine chest press',
    sets: 3,
    reps: '12',
    gif: require('../../assets/exercises/machine-chest-press.gif'),
    gifCredit: commons('Machine bench press 1.svg'),
    tips: [
      'Set the seat so the handles are at mid-chest height.',
      'Back on the pad, feet flat, stomach tight.',
      'Press until your arms are straight but not locked.',
      'Common mistake: shoulders rolling forward. Keep shoulder blades on the pad.',
      'Breathe out as you press. Breathe in as you return slowly.',
    ],
    sources: [S.seatedChestPress],
  },
  'cable-or-db-row': {
    id: 'cable-or-db-row',
    name: 'Cable or dumbbell row',
    sets: 3,
    reps: '12',
    gif: require('../../assets/exercises/seated-cable-row.gif'),
    gifCredit: commons('Cable-seated-rows-1.png'),
    tips: [
      'Cable: sit tall, knees slightly bent. Dumbbell: one knee and hand on a bench.',
      'Pull your elbow back close to your ribs.',
      'Common mistake: rounding or twisting your back. Keep it flat and still.',
      'Breathe out as you pull. Breathe in as you return slowly.',
    ],
    sources: [S.seatedRow, S.singleArmRow],
  },
  'seated-hamstring-curl': {
    id: 'seated-hamstring-curl',
    name: 'Seated hamstring curl',
    sets: 3,
    reps: '12',
    gif: require('../../assets/exercises/seated-hamstring-curl.gif'),
    gifCredit: commons('Seated-leg-curl-1.png'),
    tips: [
      'Backs of your lower legs on the pad. Lap pad snug just above your knees.',
      'Hold the handles and keep your upper body still.',
      'Pull the pad back as far as is comfortable.',
      'Common mistake: letting the weight slam back. Return slowly.',
      'Breathe out as you curl. Breathe in as you return.',
    ],
    sources: [S.seatedCurl],
  },
  'farmers-walk': {
    id: 'farmers-walk',
    name: "Farmer's walk",
    sets: 3,
    reps: '30 sec',
    gif: null, // no correctly licensed match found
    tips: [
      'Hold a dumbbell in each hand at your sides with a firm grip.',
      'Back straight, shoulders down, chest up. Look ahead.',
      'Walk with short, steady steps.',
      "Breathe normally. Don't hold your breath.",
      'Common mistake: rounding your back to pick up or drop the weights. Bend your knees.',
    ],
    sources: [S.farmersCarry],
  },
  'hammer-curls': {
    id: 'hammer-curls',
    name: 'Hammer curls',
    sets: 3,
    reps: '12',
    gif: require('../../assets/exercises/hammer-curls.gif'),
    gifCredit: commons('Bicep hammer curl with dumbbell 1.svg'),
    tips: [
      'Stand tall with palms facing your body.',
      "Keep your elbows at your sides. Don't let them drift forward.",
      'Common mistake: shrugging your shoulders or arching your back.',
      'Breathe out as you curl. Breathe in as you lower.',
      'Keep your wrists straight the whole time.',
    ],
    sources: [S.hammerCurl],
  },
};

// ---------- Weekly plan ----------
export const DAYS: WorkoutDay[] = [
  {
    weekday: 1,
    short: 'Mon',
    name: 'Monday',
    title: 'Upper Body (Push)',
    exerciseIds: [
      'db-bench-press',
      'db-shoulder-press',
      'incline-db-press',
      'lateral-raises',
      'triceps-pushdown',
      'pec-deck',
    ],
  },
  {
    weekday: 3,
    short: 'Wed',
    name: 'Wednesday',
    title: 'Lower Body',
    exerciseIds: ['goblet-squat', 'leg-press', 'leg-curl', 'walking-lunges', 'calf-raises'],
  },
  {
    weekday: 5,
    short: 'Fri',
    name: 'Friday',
    title: 'Upper Body (Pull)',
    exerciseIds: [
      'lat-pulldown',
      'seated-cable-row',
      'db-row',
      'face-pulls',
      'db-biceps-curl',
      'suitcase-carry',
    ],
  },
  {
    weekday: 0,
    short: 'Sun',
    name: 'Sunday',
    title: 'Full Body',
    exerciseIds: [
      'squat-to-press',
      'machine-chest-press',
      'cable-or-db-row',
      'seated-hamstring-curl',
      'farmers-walk',
      'hammer-curls',
    ],
  },
];

export function dayForWeekday(weekday: number): WorkoutDay | undefined {
  return DAYS.find((d) => d.weekday === weekday);
}

/** Every tick-box id for a day: "<exerciseId>#<set>" plus the walk. */
export function checklistIds(day: WorkoutDay): string[] {
  const ids: string[] = [];
  for (const id of day.exerciseIds) {
    for (let s = 1; s <= EXERCISES[id].sets; s++) ids.push(`${id}#${s}`);
  }
  ids.push(WALK.id);
  return ids;
}

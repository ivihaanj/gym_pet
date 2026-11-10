/**
 * ALL exercise data lives in this one file so it is easy to check and edit:
 * the exercise library (names, default sets/reps, GIFs, tips, sources),
 * the schedule presets, and the level ladder.
 *
 * - `gif` is a bundled file in assets/exercises (works offline from install).
 *   You can instead set `gifUrl` to a remote GIF; it is cached on the phone
 *   after the first load (expo-image disk cache).
 * - `gif: null` and no `gifUrl` shows a clean placeholder.
 * - Every tip is based on the linked source(s).
 */

export type Source = { label: string; url: string };

export type Muscle = 'Chest' | 'Shoulders' | 'Back' | 'Arms' | 'Legs' | 'Core' | 'Full body';
export const MUSCLES: Muscle[] = ['Chest', 'Shoulders', 'Back', 'Arms', 'Legs', 'Core', 'Full body'];

export type Exercise = {
  id: string;
  name: string;
  muscle: Muscle;
  sets: number; // default when added to a day
  reps: string; // default when added to a day
  gif: number | null; // require('...gif') or null
  gifUrl?: string; // optional remote GIF (cached to disk after first load)
  gifCredit?: Source; // license / attribution for the GIF
  tips: string[]; // 3-5 short tips
  sources: Source[];
};

/** One exercise placed in a day. `uid` identifies its tick boxes. */
export type PlanItem = { uid: string; exerciseId: string; sets: number; reps: string };
export type DayPlan = { title: string; items: PlanItem[] };
/** Key = weekday from JS getDay(): 0 = Sunday, 1 = Monday ... 6 = Saturday. */
export type Plan = Record<number, DayPlan>;

export const TOP_LINE = 'Warm up 5 min. Rest 60 sec between sets.';

export const WALK = {
  id: 'walk',
  label: '15 min incline walk (6-10% slope, 4.5-5.5 km/h)',
};

export const REST_SECONDS = 60;

export const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
/** Display order: Monday first. */
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

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
  frontRaise: ace(54, 'front-raise', 'Front Raise'),
  pressdown: ace(333, 'tricep-pressdown', 'Tricep Pressdown'),
  pushdowns: ace(185, 'triceps-pushdowns', 'Triceps Pushdowns'),
  ropePressdown: ace(3, 'triceps-pressdown', 'Triceps Pressdown (rope)'),
  kickback: ace(55, 'triceps-kickback', 'Triceps Kickback'),
  tricepsExt: ace(74, 'triceps-extension', 'Triceps Extension'),
  chestFly: ace(21, 'lying-chest-fly', 'Lying Chest Fly'),
  seatedChestPress: ace(188, 'seated-chest-press', 'Seated Chest Press'),
  machineShoulderPress: ace(186, 'seated-shoulder-press', 'Seated Shoulder Press (machine)'),
  reverseFly: ace(34, 'incline-reverse-fly', 'Incline Reverse Fly'),
  shrug: ace(75, 'standing-shrug', 'Standing Shrug'),
  gobletSquat: ace(362, 'goblet-squat', 'Goblet Squat'),
  bodyweightSquat: ace(135, 'bodyweight-squat', 'Bodyweight Squat'),
  legPress: ace(154, 'seated-leg-press', 'Seated Leg Press'),
  lyingCurl: ace(153, 'lying-hamstrings-curl', 'Lying Hamstrings Curl'),
  lunge: ace(94, 'forward-lunge', 'Forward Lunge'),
  calfRaise: ace(73, 'standing-calf-raises-wall', 'Standing Calf Raises'),
  calfPress: ace(294, 'calf-raise', 'Calf Raise (leg press machine)'),
  latPulldown: ace(158, 'seated-lat-pulldown', 'Seated Lat Pulldown'),
  seatedRow: ace(48, 'seated-row', 'Seated Row'),
  singleArmRow: ace(126, 'single-arm-row', 'Single-arm Row'),
  facePull: {
    label: 'NSCA – Face Pull (Machine)',
    url: 'https://www.nsca.com/education/articles/kinetic-select/face-pull-machine/',
  },
  bicepCurl: ace(70, 'bicep-curl', 'Bicep Curl'),
  seatedBicepCurl: ace(44, 'seated-biceps-curl', 'Seated Biceps Curl (dumbbells)'),
  hammerCurl: ace(10, 'hammer-curl', 'Hammer Curl'),
  suitcaseCarry: ace(358, 'suitcase-carry', 'Suitcase Carry'),
  farmersCarry: ace(359, 'farmer-s-carry', "Farmer's Carry"),
  squatPress: ace(357, 'squat-to-overhead-press', 'Squat to Overhead Press'),
  crunch: ace(52, 'crunch', 'Crunch'),
  sidePlank: ace(100, 'side-plank-modified', 'Side Plank (modified)'),
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
  nhsWarmUp: {
    label: 'NHS – How to warm up before exercising',
    url: 'https://www.nhs.uk/live-well/exercise/how-to-warm-up-before-exercising/',
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
    sources: [S.nhsWarmUp, S.kidsHealth],
  },
  {
    text: 'Ask a trained adult to show you new exercises and watch you lift.',
    sources: [S.nhs],
  },
];

/** Shown when picking a schedule. */
export const SCHEDULE_NOTE = {
  text: 'Rest a day between lifting days for the same muscles. Extra days are walk + core.',
  sources: [S.acsm, S.nsca],
};

// ---------- GIF credits ----------
const commons = (file: string, artist = 'Everkinetic', license = 'CC BY-SA 3.0', note = 'start/end frames joined into a loop'): Source => ({
  label: `${artist}, ${license} (${note})`,
  url: `https://commons.wikimedia.org/wiki/File:${file.replace(/ /g, '_')}`,
});
const tacoFleur = (file: string): Source =>
  commons(file, 'Taco Fleur', 'CC BY-SA 4.0', 'short clip from video');

// ---------- Exercise library ----------
const list: Exercise[] = [
  // ===== Chest =====
  {
    id: 'db-bench-press',
    name: 'Dumbbell bench press',
    muscle: 'Chest',
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
  {
    id: 'incline-db-press',
    name: 'Incline dumbbell press',
    muscle: 'Chest',
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
  {
    id: 'machine-chest-press',
    name: 'Machine chest press',
    muscle: 'Chest',
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
  {
    id: 'pec-deck',
    name: 'Pec deck fly machine',
    muscle: 'Chest',
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
  {
    id: 'db-flys',
    name: 'Dumbbell flys',
    muscle: 'Chest',
    sets: 3,
    reps: '12',
    gif: require('../../assets/exercises/dumbbell-flys.gif'),
    gifCredit: commons('Dumbbell-flys-1.png'),
    tips: [
      'Lie flat. Head, shoulders, butt and feet stay in contact.',
      'Keep a small bend in your elbows the whole time.',
      'Lower in a wide arc until your hands are level with your chest. No lower.',
      'Common mistake: going heavy and bending the arms into a press. Keep it light.',
      'Breathe in going down. Breathe out bringing the weights up.',
    ],
    sources: [S.chestFly],
  },

  // ===== Shoulders =====
  {
    id: 'db-shoulder-press',
    name: 'Dumbbell shoulder press',
    muscle: 'Shoulders',
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
  {
    id: 'machine-shoulder-press',
    name: 'Machine shoulder press',
    muscle: 'Shoulders',
    sets: 3,
    reps: '10-12',
    gif: require('../../assets/exercises/machine-shoulder-press.gif'),
    gifCredit: commons('Shoulder-press-machine-1.png'),
    tips: [
      'Set the seat so the handles are at shoulder height or a little higher.',
      'Back on the pad, feet flat, stomach tight.',
      'Keep elbows slightly in front of your body.',
      'Press until arms are straight but not locked. Lower slowly.',
      'Common mistake: arching your lower back. Breathe out as you press.',
    ],
    sources: [S.machineShoulderPress],
  },
  {
    id: 'lateral-raises',
    name: 'Lateral raises',
    muscle: 'Shoulders',
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
  {
    id: 'front-raise',
    name: 'Front raise',
    muscle: 'Shoulders',
    sets: 3,
    reps: '12',
    gif: require('../../assets/exercises/front-raise.gif'),
    gifCredit: commons('Dumbbell-front-raises-1.png'),
    tips: [
      'Stand tall, dumbbells in front of your thighs, small bend in your elbows.',
      'Raise the weights in front of you, only up to shoulder height.',
      'Common mistake: leaning back or swinging. Keep your stomach tight.',
      'Breathe out going up. Breathe in as you lower slowly.',
    ],
    sources: [S.frontRaise],
  },
  {
    id: 'rear-delt-raise',
    name: 'Rear delt raise (chest on bench)',
    muscle: 'Shoulders',
    sets: 3,
    reps: '12-15',
    gif: require('../../assets/exercises/rear-delt-raise.gif'),
    gifCredit: commons('Lying-rear-lateral-raise-1.png'),
    tips: [
      'Lie chest-down on an incline bench, feet on the floor.',
      'Arms hang down, small bend in elbows, palms facing each other.',
      'Raise arms out to the sides up to shoulder level. Squeeze your shoulder blades.',
      'Common mistake: lifting your chest off the bench. Keep it pressed down.',
      'Breathe out going up. Breathe in going down.',
    ],
    sources: [S.reverseFly],
  },
  {
    id: 'db-shrug',
    name: 'Dumbbell shrug',
    muscle: 'Shoulders',
    sets: 3,
    reps: '12-15',
    gif: require('../../assets/exercises/dumbbell-shrug.gif'),
    gifCredit: commons('Dumbbell-shrugs-1.png'),
    tips: [
      'Stand tall with dumbbells at your sides, palms facing you.',
      'Lift your shoulders straight up toward your ears.',
      "Don't roll your shoulders or bend your elbows.",
      'Common mistake: arching your back. Keep your stomach tight.',
      'Breathe out going up. Breathe in going down.',
    ],
    sources: [S.shrug],
  },

  // ===== Back =====
  {
    id: 'lat-pulldown',
    name: 'Lat pulldown',
    muscle: 'Back',
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
  {
    id: 'close-grip-pulldown',
    name: 'Close-grip pulldown',
    muscle: 'Back',
    sets: 3,
    reps: '10-12',
    gif: require('../../assets/exercises/close-grip-pulldown.gif'),
    gifCredit: commons('Close-grip-front-lat-pull-down-1.png'),
    tips: [
      'Set the thigh pad so it fits firmly on your thighs.',
      'Lean back only a little. Pull the handle to your upper chest.',
      'Bring your elbows down toward your sides.',
      'Common mistake: leaning far back to move the weight. Go lighter.',
      'Breathe out as you pull. Breathe in as it rises slowly.',
    ],
    sources: [S.latPulldown],
  },
  {
    id: 'seated-cable-row',
    name: 'Seated cable row',
    muscle: 'Back',
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
  {
    id: 'cable-or-db-row',
    name: 'Cable or dumbbell row',
    muscle: 'Back',
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
  {
    id: 'db-row',
    name: 'Dumbbell row',
    muscle: 'Back',
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
  {
    id: 'face-pulls',
    name: 'Face pulls',
    muscle: 'Back',
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

  // ===== Arms =====
  {
    id: 'triceps-pushdown',
    name: 'Triceps pushdown',
    muscle: 'Arms',
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
  {
    id: 'rope-pushdown',
    name: 'Rope triceps pushdown',
    muscle: 'Arms',
    sets: 3,
    reps: '12',
    gif: require('../../assets/exercises/rope-pushdown.gif'),
    gifCredit: commons('Triceps-pushdown-with-rope-1.gif'),
    tips: [
      'Stand tall, knees slightly bent. Rope at the highest spot.',
      'Keep your elbows pinned to your sides.',
      'Push down until your arms are straight, then come up slowly.',
      'Common mistake: elbows drifting forward or leaning over the rope.',
      'Breathe out pushing down. Breathe in coming up.',
    ],
    sources: [S.ropePressdown, S.pressdown],
  },
  {
    id: 'triceps-kickback',
    name: 'Triceps kickback',
    muscle: 'Arms',
    sets: 3,
    reps: '12 each arm',
    gif: require('../../assets/exercises/triceps-kickback.gif'),
    gifCredit: commons('Triceps-kickback-1.gif'),
    tips: [
      'Lean forward with one hand on a bench or your knee. Back flat.',
      'Upper arm stays close to your body and does not move.',
      'Straighten your elbow until your arm is straight, then bend back slowly.',
      'Common mistake: swinging the arm or twisting your body.',
      'Breathe out as you straighten. Breathe in as you bend.',
    ],
    sources: [S.kickback],
  },
  {
    id: 'overhead-triceps-ext',
    name: 'Overhead triceps extension',
    muscle: 'Arms',
    sets: 3,
    reps: '12',
    gif: require('../../assets/exercises/overhead-triceps-extension.gif'),
    gifCredit: commons('Seated-triceps-press-1.gif'),
    tips: [
      'Hold one dumbbell overhead with both hands. Stomach tight.',
      'Upper arms stay still, elbows point forward.',
      'Lower behind your head until elbows bend to 90 degrees. Do not hit your head.',
      'Common mistake: elbows flaring out wide. Keep them shoulder-width.',
      'Breathe in as you lower. Breathe out as you press up.',
    ],
    sources: [S.tricepsExt],
  },
  {
    id: 'db-biceps-curl',
    name: 'Dumbbell biceps curl',
    muscle: 'Arms',
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
    sources: [S.bicepCurl, S.seatedBicepCurl, S.hammerCurl],
  },
  {
    id: 'hammer-curls',
    name: 'Hammer curls',
    muscle: 'Arms',
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

  // ===== Legs =====
  {
    id: 'goblet-squat',
    name: 'Goblet squat',
    muscle: 'Legs',
    sets: 3,
    reps: '12',
    gif: require('../../assets/exercises/goblet-squat.gif'),
    gifCredit: tacoFleur('Kettlebell Goblet Squat.webm'),
    tips: [
      'Feet about shoulder-width apart. Hold one dumbbell (or kettlebell) upright at your chest.',
      'Keep your elbows close to your ribs and your back straight.',
      'Go down only as far as your back stays straight. Then push through your feet to stand.',
      'Common mistake: rounding your back. Keep your chest up.',
      'Breathe in going down. Breathe out as you stand up.',
    ],
    sources: [S.gobletSquat, S.bodyweightSquat],
  },
  {
    id: 'db-squat',
    name: 'Dumbbell squat',
    muscle: 'Legs',
    sets: 3,
    reps: '12',
    gif: require('../../assets/exercises/dumbbell-squat.gif'),
    gifCredit: commons('Squats-3-1-436x1024.png'),
    tips: [
      'Feet a little wider than hips, toes slightly out, dumbbells at your sides.',
      'Push your hips back first, then down. Chest up, back flat.',
      'Go down until thighs are about level with the floor, or less if heels lift or your back rounds.',
      'Common mistake: knees caving in. Keep knees over your second toe.',
      'Breathe in going down. Breathe out as you push up.',
    ],
    sources: [S.bodyweightSquat],
  },
  {
    id: 'leg-press',
    name: 'Leg press',
    muscle: 'Legs',
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
  {
    id: 'leg-curl',
    name: 'Leg curl machine',
    muscle: 'Legs',
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
  {
    id: 'seated-hamstring-curl',
    name: 'Seated hamstring curl',
    muscle: 'Legs',
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
  {
    id: 'walking-lunges',
    name: 'Walking lunges',
    muscle: 'Legs',
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
  {
    id: 'calf-raises',
    name: 'Calf raises',
    muscle: 'Legs',
    sets: 3,
    reps: '15',
    gif: require('../../assets/exercises/calf-raises.gif'),
    gifCredit: commons('Standing-calf-raises-1.gif'),
    tips: [
      'Stand tall, feet hip-width apart, toes pointing forward.',
      'Rise onto your toes slowly with straight knees. Hold for a moment at the top.',
      'Common mistake: bouncing. Lower your heels slowly.',
      'Breathe out going up. Breathe in going down.',
      'Use a calf machine, or hold a wall or rail for balance.',
    ],
    sources: [S.calfRaise],
  },
  {
    id: 'calf-press',
    name: 'Calf press (leg press machine)',
    muscle: 'Legs',
    sets: 3,
    reps: '15',
    gif: require('../../assets/exercises/calf-press.gif'),
    gifCredit: commons('Calves-press-on-leg-machine-1.png'),
    tips: [
      'Set the seat so your legs are straight out in front of you.',
      'Put the balls of your feet on the bottom edge of the platform.',
      'Press through your toes as far as you can. Legs stay straight, not locked.',
      'Common mistake: bouncing. Return slowly.',
      'Breathe out as you press. Breathe in as you return.',
    ],
    sources: [S.calfPress],
  },

  // ===== Core =====
  {
    id: 'crunch',
    name: 'Crunch',
    muscle: 'Core',
    sets: 3,
    reps: '12-15',
    gif: require('../../assets/exercises/crunch.gif'),
    gifCredit: {
      label: 'Everkinetic, CC BY-SA 3.0 (via wger.de; start/end frames joined into a loop)',
      url: 'https://wger.de/en/exercise/167/view-base',
    },
    tips: [
      'Lie on your back, knees bent, feet flat (or on a bench).',
      "Hands behind your head, elbows back. Don't pull on your neck.",
      'Curl your ribs toward your hips until your upper back lifts off the mat.',
      'Common mistake: going fast and using your hip muscles. Move slowly.',
      'Breathe out going up. Breathe in going down. Lower back stays on the mat.',
    ],
    sources: [S.crunch],
  },
  {
    id: 'side-plank',
    name: 'Side plank',
    muscle: 'Core',
    sets: 3,
    reps: '20 sec each side',
    gif: require('../../assets/exercises/side-plank.gif'),
    gifCredit: commons('Side-plank-1.png'),
    tips: [
      'Lie on your side with your elbow right under your shoulder.',
      'Start with knees bent (easier). Straighten your legs when it feels easy.',
      'Lift your hips so your body makes a straight line. Head in line with your spine.',
      'Common mistake: hips sagging. Lower down and rest instead.',
      'Breathe out as you lift. Keep breathing while you hold.',
    ],
    sources: [S.sidePlank],
  },

  // ===== Full body / carries =====
  {
    id: 'squat-to-press',
    name: 'Dumbbell squat to press',
    muscle: 'Full body',
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
  {
    id: 'suitcase-carry',
    name: 'Suitcase carry',
    muscle: 'Full body',
    sets: 3,
    reps: '30 sec each hand',
    gif: require('../../assets/exercises/suitcase-carry.gif'),
    gifCredit: tacoFleur('Kettlebell Farmer Walks.webm'),
    tips: [
      'Hold one weight at your side with a firm grip.',
      "Stand tall. Don't lean toward the weight or away from it.",
      'Walk slowly with short, steady steps.',
      "Breathe normally. Don't hold your breath.",
      'Switch hands after 30 seconds. Pick up and put down the weight by bending your knees.',
    ],
    sources: [S.suitcaseCarry],
  },
  {
    id: 'farmers-walk',
    name: "Farmer's walk",
    muscle: 'Full body',
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
];

export const EXERCISES: Record<string, Exercise> = Object.fromEntries(list.map((e) => [e.id, e]));
export const EXERCISE_LIST = list;

// ---------- Schedule presets ----------
/** Make a plan item using the exercise's default sets/reps unless given. */
function it(exerciseId: string, uidPrefix = '', sets?: number, reps?: string): PlanItem {
  const ex = EXERCISES[exerciseId];
  return { uid: `${uidPrefix}${exerciseId}`, exerciseId, sets: sets ?? ex.sets, reps: reps ?? ex.reps };
}

/** The original 4-day plan. Exercises, sets and reps exactly as given. */
const ORIGINAL: Plan = {
  1: {
    title: 'Upper Body (Push)',
    items: [
      it('db-bench-press', '', 3, '10-12'),
      it('db-shoulder-press', '', 3, '10-12'),
      it('incline-db-press', '', 3, '10-12'),
      it('lateral-raises', '', 3, '12-15'),
      it('triceps-pushdown', '', 3, '12'),
      it('pec-deck', '', 3, '12-15'),
    ],
  },
  3: {
    title: 'Lower Body',
    items: [
      it('goblet-squat', '', 3, '12'),
      it('leg-press', '', 3, '12'),
      it('leg-curl', '', 3, '12'),
      it('walking-lunges', '', 3, '10 each leg'),
      it('calf-raises', '', 3, '15'),
    ],
  },
  5: {
    title: 'Upper Body (Pull)',
    items: [
      it('lat-pulldown', '', 3, '10-12'),
      it('seated-cable-row', '', 3, '10-12'),
      it('db-row', '', 3, '12'),
      it('face-pulls', '', 3, '15'),
      it('db-biceps-curl', '', 3, '12'),
      it('suitcase-carry', '', 3, '30 sec each hand'),
    ],
  },
  0: {
    title: 'Full Body',
    items: [
      it('squat-to-press', '', 3, '12'),
      it('machine-chest-press', '', 3, '12'),
      it('cable-or-db-row', '', 3, '12'),
      it('seated-hamstring-curl', '', 3, '12'),
      it('farmers-walk', '', 3, '30 sec'),
      it('hammer-curls', '', 3, '12'),
    ],
  },
};

const fullA = (p: string): DayPlan => ({
  title: 'Full Body A',
  items: ['goblet-squat', 'machine-chest-press', 'lat-pulldown', 'db-shoulder-press', 'seated-hamstring-curl', 'side-plank'].map((id) => it(id, p)),
});
const fullB = (p: string): DayPlan => ({
  title: 'Full Body B',
  items: ['leg-press', 'db-bench-press', 'seated-cable-row', 'lateral-raises', 'walking-lunges', 'crunch'].map((id) => it(id, p)),
});
const fullC = (p: string): DayPlan => ({
  title: 'Full Body C',
  items: ['db-squat', 'incline-db-press', 'close-grip-pulldown', 'rear-delt-raise', 'calf-press', 'hammer-curls'].map((id) => it(id, p)),
});
/** Light day: core work plus the incline walk. */
export const cardioCore = (p: string): DayPlan => ({
  title: 'Walk + Core',
  items: ['side-plank', 'crunch', 'suitcase-carry'].map((id) => it(id, p)),
});

export type Preset = { id: string; name: string; short: string; plan: Plan };

export const PRESETS: Preset[] = [
  { id: 'original', name: 'Your 4-day plan', short: 'Mon · Wed · Fri · Sun', plan: ORIGINAL },
  { id: 'two', name: '2 days · Full body', short: 'Mon · Thu', plan: { 1: fullA('m-'), 4: fullB('t-') } },
  { id: 'three', name: '3 days · Full body', short: 'Mon · Wed · Fri', plan: { 1: fullA('m-'), 3: fullB('w-'), 5: fullC('f-') } },
  { id: 'five', name: '5 days', short: '4-day plan + Tue walk & core', plan: { ...ORIGINAL, 2: cardioCore('tu-') } },
  { id: 'six', name: '6 days', short: '4-day plan + Tue, Thu walk & core', plan: { ...ORIGINAL, 2: cardioCore('tu-'), 4: cardioCore('th-') } },
  { id: 'seven', name: '7 days', short: '4-day plan + Tue, Thu, Sat walk & core', plan: { ...ORIGINAL, 2: cardioCore('tu-'), 4: cardioCore('th-'), 6: cardioCore('sa-') } },
];

export const DEFAULT_PRESET = PRESETS[0];

/** Every tick-box id for a day: "<uid>#<set>" plus the walk. */
export function checklistIds(day: DayPlan | undefined): string[] {
  if (!day) return [];
  const ids: string[] = [];
  for (const item of day.items) {
    for (let s = 1; s <= item.sets; s++) ids.push(`${item.uid}#${s}`);
  }
  ids.push(WALK.id);
  return ids;
}

// ---------- Levels (game) ----------
export const XP = { perTick: 10, dayComplete: 50, streakBonusPerDay: 5, streakBonusCap: 10 };

export const LEVELS: { title: string; xp: number }[] = [
  { title: 'Couch Starter', xp: 0 },
  { title: 'Gym Newbie', xp: 150 },
  { title: 'Rookie Lifter', xp: 500 },
  { title: 'Regular', xp: 1200 },
  { title: 'Iron Apprentice', xp: 2500 },
  { title: 'Gym Rat', xp: 4500 },
  { title: 'Strong Teen', xp: 7500 },
  { title: 'Local Champ', xp: 11500 },
  { title: 'Regional Champ', xp: 16500 },
  { title: 'National Champ', xp: 23000 },
  { title: 'Pro Card', xp: 31000 },
  { title: 'Elite Pro', xp: 41000 },
  { title: 'Mr. Olympia', xp: 52000 },
];

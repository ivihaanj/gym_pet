# Gym Pet

A simple workout tracker for a beginner teen (Expo / React Native, Android + web).

- **Today**: today's workout, or "Rest day" and the next workout.
- **Plan**: your workout days. Tap **Edit** to add, remove, replace or reorder exercises and change sets and reps.
- **Stats**: monthly calendar, streak, done and missed this month.
- **Me**: level, XP, streaks and the road to Mr. Olympia.
- First launch asks for your name, your days (the original 4-day plan is the default; 2, 3, 5, 6 or 7 days, or any custom days) and a workout time with an optional reminder.
- Works offline. Everything is saved on the phone (AsyncStorage). No login.

## Edit the exercises

All exercise data (names, default sets/reps, GIFs, tips, sources), the schedule presets and the levels are in one file:
[`src/data/plan.ts`](src/data/plan.ts).

## Run

```bash
npm install
npx expo start          # scan the QR code with Expo Go
npx expo start --web    # http://localhost:8081
```

## Build an APK

```bash
npx eas-cli@latest login
npx eas-cli@latest build -p android --profile preview
```

## Image credits

- Most exercise GIFs in `assets/exercises/` are made from drawings by **Everkinetic**
  (via Wikimedia Commons; the crunch via wger.de), licensed **CC BY-SA 3.0**
  (https://creativecommons.org/licenses/by-sa/3.0/). Each GIF joins the start and end drawings into a loop.
- The goblet squat and suitcase carry GIFs are short clips from videos by **Taco Fleur**
  (Wikimedia Commons), licensed **CC BY-SA 4.0** (https://creativecommons.org/licenses/by-sa/4.0/).
- These GIFs are shared under the same licenses. Every source file is listed in
  `assets/exercises/_image-sources.json`.
- The app icon / mascot was made with Blueprint Studio Asset Generator.

Tips are short summaries of guidance from ACE, NSCA, ACSM, NHS and KidsHealth.
Each exercise page in the app links to its sources.

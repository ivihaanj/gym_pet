# Gym Pet

A simple Android workout tracker for a beginner teen (Expo / React Native).

- **Today**: today's workout, or "Rest day" and the next workout.
- **Days**: Monday, Wednesday, Friday, Sunday.
- **Stats**: monthly calendar, streak, done and missed this month.
- Works offline. Everything is saved on the phone (AsyncStorage). No login.

## Edit the plan

All exercise data (names, sets, reps, GIFs, tips, sources) is in one file:
[`src/data/plan.ts`](src/data/plan.ts).

## Run

```bash
npm install
npx expo start          # scan the QR code with Expo Go
```

## Build an APK

```bash
npx eas-cli@latest login
npx eas-cli@latest build -p android --profile preview
```

## Image credits

Exercise GIFs in `assets/exercises/` are made from drawings by **Everkinetic**
(via Wikimedia Commons), licensed **CC BY-SA 3.0**
(https://creativecommons.org/licenses/by-sa/3.0/). Each GIF joins the start and
end drawings into a loop. The GIFs are shared under the same license. The source
file for each one is listed in `assets/exercises/_commons-sources.json`.

Tips are short summaries of guidance from ACE, NSCA, ACSM, NHS and KidsHealth.
Each exercise page in the app links to its sources.

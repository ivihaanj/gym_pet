import { useColorScheme, type ViewStyle } from 'react-native';

/**
 * Soft neumorphism + minimalism: every surface shares the background color and
 * is shaped only by a light shadow (top-left) and a dark shadow (bottom-right).
 * One accent color.
 */
const lightBase = {
  bg: '#ECEEF3',
  text: '#1F2330',
  muted: '#7A8091',
  border: '#D9DCE5',
  accent: '#5B5BD6',
  accentSoft: '#E1E2F7',
  onAccent: '#FFFFFF',
  green: '#22C55E',
  red: '#EF4444',
  yellow: '#EAB308',
  grey: '#DADDE6',
  shadowLight: '#FFFFFF',
  shadowDark: '#C5C9D6',
};

const darkBase: typeof lightBase = {
  bg: '#1E2026',
  text: '#EDEEF2',
  muted: '#9AA0AE',
  border: '#30333C',
  accent: '#8B8CF6',
  accentSoft: '#2C2D4A',
  onAccent: '#14151A',
  green: '#22C55E',
  red: '#EF4444',
  yellow: '#EAB308',
  grey: '#2E3139',
  shadowLight: '#2A2D35',
  shadowDark: '#131418',
};

function withNeu(b: typeof lightBase) {
  const out = (d: number, blur: number) =>
    `-${d}px -${d}px ${blur}px ${b.shadowLight}, ${d}px ${d}px ${blur}px ${b.shadowDark}`;
  const inn = (d: number, blur: number) =>
    `inset ${d}px ${d}px ${blur}px ${b.shadowDark}, inset -${d}px -${d}px ${blur}px ${b.shadowLight}`;
  return {
    ...b,
    /** Kept for older code: surfaces are the background in neumorphism. */
    surface: b.bg,
    /** Raised card. */
    raised: { backgroundColor: b.bg, boxShadow: out(6, 14) } as ViewStyle,
    /** Small raised element (chips, buttons). */
    raisedSm: { backgroundColor: b.bg, boxShadow: out(3, 7) } as ViewStyle,
    /** Pressed-in well (inputs, tracks, empty tick boxes). */
    inset: { backgroundColor: b.bg, boxShadow: inn(3, 6) } as ViewStyle,
    /** Accent button with a soft glow. */
    accentRaised: {
      backgroundColor: b.accent,
      boxShadow: `-3px -3px 7px ${b.shadowLight}, 4px 4px 10px ${b.shadowDark}`,
    } as ViewStyle,
  };
}

const light = withNeu(lightBase);
const dark = withNeu(darkBase);

export type Colors = typeof light;

export function useColors(): Colors {
  return useColorScheme() === 'dark' ? dark : light;
}

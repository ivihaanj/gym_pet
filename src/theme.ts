import { useColorScheme } from 'react-native';

const light = {
  bg: '#FFFFFF',
  surface: '#F5F6F8',
  text: '#111318',
  muted: '#6B7280',
  border: '#E6E8EC',
  accent: '#5B5BD6',
  accentSoft: '#EEEEFC',
  onAccent: '#FFFFFF',
  green: '#22C55E',
  red: '#EF4444',
  yellow: '#EAB308',
  grey: '#E5E7EB',
};

const dark: typeof light = {
  bg: '#0E0F12',
  surface: '#17191E',
  text: '#F2F3F5',
  muted: '#9CA3AF',
  border: '#262A31',
  accent: '#8B8CF6',
  accentSoft: '#23244A',
  onAccent: '#0E0F12',
  green: '#22C55E',
  red: '#EF4444',
  yellow: '#EAB308',
  grey: '#2A2E35',
};

export type Colors = typeof light;

export function useColors(): Colors {
  return useColorScheme() === 'dark' ? dark : light;
}

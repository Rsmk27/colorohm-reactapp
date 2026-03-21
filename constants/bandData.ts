export type BandColorKey =
  | 'black'
  | 'brown'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'violet'
  | 'gray'
  | 'white'
  | 'gold'
  | 'silver'
  | 'none';

export type BandMeta = {
  hex: string;
  digit: number | null;
  multiplier: number | null;
  tolerance: number | null;
  ppm: number | null;
};

export const bandColors: Record<BandColorKey, BandMeta> = {
  black: { hex: '#1a1a1a', digit: 0, multiplier: 1, tolerance: null, ppm: 250 },
  brown: { hex: '#8B4513', digit: 1, multiplier: 10, tolerance: 1, ppm: 100 },
  red: { hex: '#DC2626', digit: 2, multiplier: 100, tolerance: 2, ppm: 50 },
  orange: { hex: '#F97316', digit: 3, multiplier: 1000, tolerance: null, ppm: 15 },
  yellow: { hex: '#EAB308', digit: 4, multiplier: 10000, tolerance: null, ppm: 25 },
  green: { hex: '#16A34A', digit: 5, multiplier: 100000, tolerance: 0.5, ppm: 20 },
  blue: { hex: '#2563EB', digit: 6, multiplier: 1000000, tolerance: 0.25, ppm: 10 },
  violet: { hex: '#7C3AED', digit: 7, multiplier: 10000000, tolerance: 0.1, ppm: 5 },
  gray: { hex: '#6B7280', digit: 8, multiplier: 0.01, tolerance: 0.05, ppm: 1 },
  white: { hex: '#F9FAFB', digit: 9, multiplier: 0.1, tolerance: null, ppm: null },
  gold: { hex: '#D97706', digit: null, multiplier: 0.1, tolerance: 5, ppm: null },
  silver: { hex: '#9CA3AF', digit: null, multiplier: 0.01, tolerance: 10, ppm: null },
  none: { hex: 'transparent', digit: null, multiplier: null, tolerance: 20, ppm: null },
};

export const significantDigits: BandColorKey[] = [
  'black',
  'brown',
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'violet',
  'gray',
  'white',
];

export const multiplierColors: BandColorKey[] = [
  'black',
  'brown',
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'violet',
  'gray',
  'white',
  'gold',
  'silver',
];

export const toleranceColors: BandColorKey[] = [
  'brown',
  'red',
  'green',
  'blue',
  'violet',
  'gray',
  'gold',
  'silver',
  'none',
];

export const ppmColors: BandColorKey[] = [
  'black',
  'brown',
  'red',
  'orange',
  'yellow',
  'blue',
  'violet',
  'gray',
];

export const defaultBandsByCount: Record<3 | 4 | 5 | 6, BandColorKey[]> = {
  3: ['brown', 'black', 'red'],
  4: ['yellow', 'violet', 'brown', 'gold'],
  5: ['brown', 'black', 'black', 'red', 'brown'],
  6: ['brown', 'black', 'black', 'red', 'brown', 'red'],
};

export function bandOptionsForPosition(
  bandCount: 3 | 4 | 5 | 6,
  index: number,
): BandColorKey[] {
  if (bandCount === 3) {
    if (index < 2) return significantDigits;
    return multiplierColors;
  }

  if (bandCount === 4) {
    if (index < 2) return significantDigits;
    if (index === 2) return multiplierColors;
    return toleranceColors;
  }

  if (bandCount === 5) {
    if (index < 3) return significantDigits;
    if (index === 3) return multiplierColors;
    return toleranceColors;
  }

  if (index < 3) return significantDigits;
  if (index === 3) return multiplierColors;
  if (index === 4) return toleranceColors;
  return ppmColors;
}

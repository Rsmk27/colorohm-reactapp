import { bandColors, BandColorKey } from '../constants/bandData';

const E24_BASE = [
  1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0,
  3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1,
];

const E96_BASE = [
  1.0, 1.02, 1.05, 1.07, 1.1, 1.13, 1.15, 1.18, 1.21, 1.24, 1.27, 1.3,
  1.33, 1.37, 1.4, 1.43, 1.47, 1.5, 1.54, 1.58, 1.62, 1.65, 1.69, 1.74,
  1.78, 1.82, 1.87, 1.91, 1.96, 2.0, 2.05, 2.1, 2.15, 2.21, 2.26, 2.32,
  2.37, 2.43, 2.49, 2.55, 2.61, 2.67, 2.74, 2.8, 2.87, 2.94, 3.01, 3.09,
  3.16, 3.24, 3.32, 3.4, 3.48, 3.57, 3.65, 3.74, 3.83, 3.92, 4.02, 4.12,
  4.22, 4.32, 4.42, 4.53, 4.64, 4.75, 4.87, 4.99, 5.11, 5.23, 5.36, 5.49,
  5.62, 5.76, 5.9, 6.04, 6.19, 6.34, 6.49, 6.65, 6.81, 6.98, 7.15, 7.32,
  7.5, 7.68, 7.87, 8.06, 8.25, 8.45, 8.66, 8.87, 9.09, 9.31, 9.53, 9.76,
];

type EncodeOptions = {
  ohms: number;
  bandCount: 3 | 4 | 5 | 6;
  tolerance: number;
  ppm?: number | null;
};

type EncodeResult = {
  bands: BandColorKey[];
  nearest: number;
  exact: boolean;
  series: 'E24' | 'E96';
  toleranceUsed: number;
  ppmUsed: number | null;
};

function closestPreferred(ohms: number, series: 'E24' | 'E96'): number {
  const values = series === 'E24' ? E24_BASE : E96_BASE;
  const exponent = Math.floor(Math.log10(ohms));
  let best = ohms;
  let bestDiff = Number.MAX_VALUE;

  for (let e = exponent - 1; e <= exponent + 1; e += 1) {
    const scale = 10 ** e;
    for (const base of values) {
      const candidate = base * scale;
      const diff = Math.abs(candidate - ohms);
      if (diff < bestDiff) {
        best = candidate;
        bestDiff = diff;
      }
    }
  }

  return best;
}

function colorByDigit(digit: number): BandColorKey {
  return (
    Object.keys(bandColors) as BandColorKey[]
  ).find((name) => bandColors[name].digit === digit) as BandColorKey;
}

function colorByMultiplier(multiplier: number): BandColorKey | null {
  return (
    Object.keys(bandColors) as BandColorKey[]
  ).find((name) => bandColors[name].multiplier === multiplier) ?? null;
}

function colorByTolerance(tolerance: number): BandColorKey | null {
  return (
    Object.keys(bandColors) as BandColorKey[]
  ).find((name) => bandColors[name].tolerance === tolerance) ?? null;
}

function colorByPpm(ppm: number): BandColorKey | null {
  return (
    Object.keys(bandColors) as BandColorKey[]
  ).find((name) => bandColors[name].ppm === ppm) ?? null;
}

function nearestPpm(ppm: number): number {
  const supported = [1, 5, 10, 15, 20, 25, 50, 100, 250];
  return supported.reduce((best, current) => {
    if (Math.abs(current - ppm) < Math.abs(best - ppm)) {
      return current;
    }
    return best;
  }, supported[0]);
}

export function encodeResistor(options: EncodeOptions): EncodeResult | null {
  const { ohms, bandCount, tolerance, ppm } = options;
  if (!Number.isFinite(ohms) || ohms <= 0) {
    return null;
  }

  const toleranceUsed = bandCount === 3 ? 20 : tolerance;
  const series = toleranceUsed <= 1 ? 'E96' : 'E24';
  const nearest = closestPreferred(ohms, series);
  const exact = Math.abs(nearest - ohms) < 1e-9;

  const sigDigitsCount = bandCount <= 4 ? 2 : 3;
  const exponent = Math.floor(Math.log10(nearest));
  const normalized = nearest / 10 ** exponent;
  const sig = Math.round(normalized * 10 ** (sigDigitsCount - 1));
  const multiplierPower = exponent - (sigDigitsCount - 1);
  const multiplier = 10 ** multiplierPower;

  const digits = sig
    .toString()
    .padStart(sigDigitsCount, '0')
    .slice(0, sigDigitsCount)
    .split('')
    .map((d) => Number(d));

  if (digits[0] === 0) {
    return null;
  }

  const digitColors = digits.map(colorByDigit);
  const multiplierColor = colorByMultiplier(multiplier);
  const toleranceColor = colorByTolerance(toleranceUsed);
  const ppmUsed = bandCount === 6 ? nearestPpm(ppm ?? (toleranceUsed <= 1 ? 50 : 100)) : null;
  const ppmColor = ppmUsed === null ? null : colorByPpm(ppmUsed);

  if (!multiplierColor || digitColors.some((c) => !c)) {
    return null;
  }

  if (bandCount === 3) {
    return {
      bands: [...digitColors, multiplierColor],
      nearest,
      exact,
      series,
      toleranceUsed,
      ppmUsed: null,
    };
  }

  if (!toleranceColor) {
    return null;
  }

  if (bandCount === 6 && !ppmColor) {
    return null;
  }

  const baseBands = [...digitColors, multiplierColor, toleranceColor];

  return {
    bands: bandCount === 6 ? [...baseBands, ppmColor as BandColorKey] : baseBands,
    nearest,
    exact,
    series,
    toleranceUsed,
    ppmUsed,
  };
}

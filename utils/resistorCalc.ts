import { bandColors, BandColorKey } from '../constants/bandData';

export type BandCount = 3 | 4 | 5 | 6;

export type ResistorResult = {
  value: number;
  tolerance: number | null;
  min: number | null;
  max: number | null;
  ppm: number | null;
};

export function decodeResistor(
  bands: BandColorKey[],
  bandCount: BandCount,
): ResistorResult | null {
  const activeBands = bands.slice(0, bandCount);

  if (activeBands.some((band) => !band || band === 'none')) {
    return null;
  }

  const sigDigitsCount = bandCount <= 4 ? 2 : 3;
  const sigBandKeys = activeBands.slice(0, sigDigitsCount);
  const sigDigits = sigBandKeys.map((key) => bandColors[key].digit);

  if (sigDigits.some((digit) => digit === null)) {
    return null;
  }

  if ((sigDigits[0] ?? 0) === 0) {
    throw new Error('First significant digit cannot be black (0).');
  }

  const significantValue = Number(sigDigits.join(''));
  const multiplierKey = activeBands[sigDigitsCount];
  const multiplier = bandColors[multiplierKey].multiplier;

  if (multiplier === null) {
    return null;
  }

  const value = significantValue * multiplier;

  let tolerance: number | null = null;
  if (bandCount >= 4) {
    const toleranceBandIndex = bandCount === 6 ? 4 : bandCount - 1;
    tolerance = bandColors[activeBands[toleranceBandIndex]].tolerance;
  }

  const min = tolerance === null ? null : value * (1 - tolerance / 100);
  const max = tolerance === null ? null : value * (1 + tolerance / 100);

  const ppm = bandCount === 6 ? bandColors[activeBands[5]].ppm : null;

  return {
    value,
    tolerance,
    min,
    max,
    ppm,
  };
}

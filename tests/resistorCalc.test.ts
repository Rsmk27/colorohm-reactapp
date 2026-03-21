import { describe, expect, it } from 'vitest';

import { decodeResistor } from '../utils/resistorCalc';

describe('decodeResistor', () => {
  it('decodes 4-band resistor correctly', () => {
    const result = decodeResistor(['yellow', 'violet', 'red', 'gold'], 4);
    expect(result?.value).toBe(4700);
    expect(result?.tolerance).toBe(5);
    expect(result?.min).toBeCloseTo(4465);
    expect(result?.max).toBeCloseTo(4935);
  });

  it('decodes 6-band resistor with ppm', () => {
    const result = decodeResistor(['brown', 'black', 'black', 'red', 'brown', 'red'], 6);
    expect(result?.value).toBe(10_000);
    expect(result?.tolerance).toBe(1);
    expect(result?.ppm).toBe(50);
  });

  it('returns null if band is none', () => {
    const result = decodeResistor(['brown', 'none', 'red', 'gold'], 4);
    expect(result).toBeNull();
  });
});

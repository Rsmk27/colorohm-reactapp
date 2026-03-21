import { describe, expect, it } from 'vitest';

import { encodeResistor } from '../utils/encodeResistor';

describe('encodeResistor', () => {
  it('encodes 220Ω 3-band and forces ±20 tolerance behavior', () => {
    const result = encodeResistor({ ohms: 220, bandCount: 3, tolerance: 5 });
    expect(result?.bands).toEqual(['red', 'red', 'brown']);
    expect(result?.toleranceUsed).toBe(20);
    expect(result?.ppmUsed).toBeNull();
  });

  it('encodes 4.7kΩ 5% to yellow violet red gold', () => {
    const result = encodeResistor({ ohms: 4700, bandCount: 4, tolerance: 5 });
    expect(result?.bands).toEqual(['yellow', 'violet', 'red', 'gold']);
    expect(result?.series).toBe('E24');
  });

  it('encodes precision value with E96 for low tolerance', () => {
    const result = encodeResistor({ ohms: 10200, bandCount: 5, tolerance: 1 });
    expect(result).not.toBeNull();
    expect(result?.series).toBe('E96');
    expect(result?.bands.length).toBe(5);
  });

  it('encodes 6-band resistor with ppm band', () => {
    const result = encodeResistor({ ohms: 10000, bandCount: 6, tolerance: 1, ppm: 50 });
    expect(result).not.toBeNull();
    expect(result?.bands.length).toBe(6);
    expect(result?.ppmUsed).toBe(50);
  });

  it('returns null for invalid non-positive input', () => {
    expect(encodeResistor({ ohms: 0, bandCount: 4, tolerance: 5 })).toBeNull();
  });
});

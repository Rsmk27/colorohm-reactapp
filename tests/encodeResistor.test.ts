import { describe, expect, it } from 'vitest';

import { encodeResistor } from '../utils/encodeResistor';

describe('encodeResistor', () => {
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

  it('returns null for invalid non-positive input', () => {
    expect(encodeResistor({ ohms: 0, bandCount: 4, tolerance: 5 })).toBeNull();
  });
});

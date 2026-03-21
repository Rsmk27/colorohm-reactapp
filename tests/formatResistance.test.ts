import { describe, expect, it } from 'vitest';

import { formatResistance } from '../utils/formatResistance';

describe('formatResistance', () => {
  it('formats ohms under 1000 with ohm unit', () => {
    expect(formatResistance(470)).toContain('Ω');
  });

  it('formats kilo-ohms', () => {
    expect(formatResistance(4700)).toContain('kΩ');
  });

  it('formats mega-ohms', () => {
    expect(formatResistance(2_200_000)).toContain('MΩ');
  });
});

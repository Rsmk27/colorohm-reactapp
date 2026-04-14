export const E24: number[] = [
  1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1,
  10, 11, 12, 13, 15, 16, 18, 20, 22, 24, 27, 30, 33, 36, 39, 43, 47, 51, 56, 62, 68, 75, 82, 91,
  100, 110, 120, 130, 150, 160, 180, 200, 220, 240, 270, 300, 330, 360, 390, 430, 470, 510, 560, 620, 680, 750, 820, 910,
  1000, 1100, 1200, 1300, 1500, 1600, 1800, 2000, 2200, 2400, 2700, 3000, 3300, 3600, 3900, 4300, 4700, 5100, 5600, 6200, 6800, 7500, 8200, 9100,
];

export function getRandomE24(): string {
  const multipliers = [1, 10, 100, 1000, 10000, 100000, 1000000];
  const base = Math.floor(Math.random() * E24.length);
  const mult = multipliers[Math.floor(Math.random() * multipliers.length)];
  const value = E24[base] * mult;

  // simple format func
  if (value >= 1e6) {
    return (value / 1e6).toFixed(value % 1e6 === 0 ? 0 : 2).replace(/\.00$/, '').replace(/0$/, '') + 'MΩ';
  }
  if (value >= 1e3) {
    return (value / 1e3).toFixed(value % 1e3 === 0 ? 0 : 2).replace(/\.00$/, '').replace(/0$/, '') + 'kΩ';
  }
  return value.toFixed(value % 1 === 0 ? 0 : 2).replace(/\.00$/, '').replace(/0$/, '') + 'Ω';
}

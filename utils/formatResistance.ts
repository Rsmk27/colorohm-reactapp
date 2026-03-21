export function formatResistance(ohms: number): string {
  if (!Number.isFinite(ohms)) {
    return '--';
  }

  if (ohms >= 1_000_000) {
    return `${(ohms / 1_000_000).toPrecision(4)} MΩ`;
  }

  if (ohms >= 1_000) {
    return `${(ohms / 1_000).toPrecision(4)} kΩ`;
  }

  return `${ohms.toPrecision(4)} Ω`;
}

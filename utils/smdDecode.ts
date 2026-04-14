/**
 * SMD Resistor Code Decoder
 *
 * Supports:
 * - 3-digit numeric codes (e.g. 472 → 4.7kΩ)
 * - 4-digit numeric codes (e.g. 4702 → 47kΩ)
 * - R notation codes (e.g. 4R7, R47, 47R)
 */

export type SMDDecodeResult = {
  ohms: number;
  formatted: string;
  tolerance: string | null;
  explanation: string;
  format: '3-digit' | '4-digit' | 'R-notation';
};

function formatOhms(ohms: number): string {
  if (!Number.isFinite(ohms) || ohms < 0) return '--';

  if (ohms >= 1_000_000) {
    const val = ohms / 1_000_000;
    return `${parseFloat(val.toPrecision(4))}MΩ`;
  }

  if (ohms >= 1_000) {
    const val = ohms / 1_000;
    return `${parseFloat(val.toPrecision(4))}kΩ`;
  }

  return `${parseFloat(ohms.toPrecision(4))}Ω`;
}

function decode3Digit(code: string): SMDDecodeResult | null {
  if (!/^\d{3}$/.test(code)) return null;

  const sig = parseInt(code.slice(0, 2), 10);
  const multiplierDigit = parseInt(code[2], 10);

  // Special case: digit 9 means ×10^-1 = ×0.1
  const multiplier = multiplierDigit === 9 ? 0.1 : Math.pow(10, multiplierDigit);
  const ohms = sig * multiplier;

  const multiplierText =
    multiplierDigit === 9
      ? '×0.1'
      : multiplierDigit === 0
        ? '×1'
        : `×10${multiplierDigit > 1 ? `^${multiplierDigit}` : ''}`;

  return {
    ohms,
    formatted: formatOhms(ohms),
    tolerance: '±5% (typical)',
    explanation: `3-digit code: ${code[0]}${code[1]} (significant figures) + ${code[2]} (multiplier ${multiplierText}) = ${sig} ${multiplierText} = ${formatOhms(ohms)}`,
    format: '3-digit',
  };
}

function decode4Digit(code: string): SMDDecodeResult | null {
  if (!/^\d{4}$/.test(code)) return null;

  const sig = parseInt(code.slice(0, 3), 10);
  const multiplierDigit = parseInt(code[3], 10);

  // Special case: digit 9 means ×10^-1 = ×0.1
  const multiplier = multiplierDigit === 9 ? 0.1 : Math.pow(10, multiplierDigit);
  const ohms = sig * multiplier;

  const multiplierText =
    multiplierDigit === 9
      ? '×0.1'
      : multiplierDigit === 0
        ? '×1'
        : `×10${multiplierDigit > 1 ? `^${multiplierDigit}` : ''}`;

  return {
    ohms,
    formatted: formatOhms(ohms),
    tolerance: '±1% (typical)',
    explanation: `4-digit code: ${code.slice(0, 3)} (significant figures) + ${code[3]} (multiplier ${multiplierText}) = ${sig} ${multiplierText} = ${formatOhms(ohms)}`,
    format: '4-digit',
  };
}

function decodeRNotation(code: string): SMDDecodeResult | null {
  const upper = code.toUpperCase();
  const rIndex = upper.indexOf('R');
  if (rIndex === -1) return null;

  const before = upper.slice(0, rIndex);
  const after = upper.slice(rIndex + 1);

  // Validate: only digits allowed before and after R
  if ((before.length > 0 && !/^\d+$/.test(before)) || (after.length > 0 && !/^\d+$/.test(after))) {
    return null;
  }

  // At least one side of R must have digits
  if (before.length === 0 && after.length === 0) return null;

  let ohms: number;
  let explanation: string;

  if (before.length === 0) {
    // R47 → 0.47Ω
    ohms = parseFloat(`0.${after}`);
    explanation = `R-notation: R replaces the decimal point. R${after} = 0.${after}Ω`;
  } else if (after.length === 0) {
    // 47R → 47.0Ω
    ohms = parseFloat(before);
    explanation = `R-notation: R replaces the decimal point. ${before}R = ${before}.0Ω`;
  } else {
    // 4R7 → 4.7Ω
    ohms = parseFloat(`${before}.${after}`);
    explanation = `R-notation: R replaces the decimal point. ${before}R${after} = ${before}.${after}Ω`;
  }

  return {
    ohms,
    formatted: formatOhms(ohms),
    tolerance: null,
    explanation,
    format: 'R-notation',
  };
}

export function decodeSMD(code: string): SMDDecodeResult | null {
  const trimmed = code.trim();
  if (trimmed.length === 0) return null;

  // Try R notation first (contains letters)
  if (/[rR]/.test(trimmed)) {
    return decodeRNotation(trimmed);
  }

  // Try numeric codes
  if (/^\d{4}$/.test(trimmed)) {
    return decode4Digit(trimmed);
  }

  if (/^\d{3}$/.test(trimmed)) {
    return decode3Digit(trimmed);
  }

  return null;
}

type Rgb = readonly [number, number, number];

/** Escala inspirada nas warming stripes de Ed Hawkins (azul = mais frio, vermelho = mais quente). */
const STOPS: readonly (readonly [number, Rgb])[] = [
  [-0.2, [8, 48, 107]],
  [0.1, [33, 113, 181]],
  [0.4, [158, 202, 225]],
  [0.7, [254, 224, 210]],
  [1.1, [252, 146, 114]],
  [1.6, [239, 59, 44]],
  [2.5, [165, 15, 21]],
  [3.5, [103, 0, 13]],
  [4.5, [59, 0, 8]],
];

const SKY_CLEAN: Rgb = [143, 207, 227];
const SKY_SMOG: Rgb = [217, 160, 102];

export function warmingColor(anomaly: number): string {
  const upper = STOPS.findIndex(([value]) => anomaly <= value);
  if (upper === 0) return toCss(STOPS[0][1]);
  if (upper === -1) return toCss(STOPS[STOPS.length - 1][1]);

  const [fromValue, from] = STOPS[upper - 1];
  const [toValue, to] = STOPS[upper];
  return toCss(mix(from, to, (anomaly - fromValue) / (toValue - fromValue)));
}

/** Mistura entre o céu limpo e o céu de fumaça conforme o risco (0–1). */
export function skyColor(risk: number): string {
  return toCss(mix(SKY_CLEAN, SKY_SMOG, risk));
}

function mix(from: Rgb, to: Rgb, t: number): Rgb {
  return [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t, from[2] + (to[2] - from[2]) * t];
}

function toCss([r, g, b]: Rgb): string {
  return `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)})`;
}

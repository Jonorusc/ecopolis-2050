/**
 * Modelo educativo simplificado: "e se todas as cidades do mundo seguissem o seu caminho?".
 * A razão entre as emissões da cidade e as do início do jogo é mapeada para a faixa de
 * aquecimento em 2100 dos cenários do IPCC AR6 (SSP1-1.9 ≈ 1,4 °C … SSP3-7.0 ≈ 3,6 °C).
 */
const BEST_CASE_WARMING = 1.3;
const BASELINE_WARMING = 3.6;
const WARMING_SPAN = BASELINE_WARMING - BEST_CASE_WARMING;
const MAX_WARMING = 5;

/** Peso das emissões atuais vs. a média histórica (o CO₂ acumulado também importa). */
const CURRENT_WEIGHT = 0.7;

export function projectWarming(emissionHistory: readonly number[], initialEmissions: number): number {
  if (emissionHistory.length === 0 || initialEmissions <= 0) return BASELINE_WARMING;

  const ratios = emissionHistory.map((emissions) => emissions / initialEmissions);
  const current = ratios[ratios.length - 1];
  const average = ratios.reduce((sum, ratio) => sum + ratio, 0) / ratios.length;
  const blended = CURRENT_WEIGHT * current + (1 - CURRENT_WEIGHT) * average;

  const warming = BEST_CASE_WARMING + WARMING_SPAN * blended;
  return clamp(warming, BEST_CASE_WARMING - 0.1, MAX_WARMING);
}

/** Intensidade de risco climático (0–1) usada para a probabilidade de eventos extremos. */
export function climateRisk(projectedWarming: number): number {
  return clamp((projectedWarming - BEST_CASE_WARMING) / WARMING_SPAN, 0, 1);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

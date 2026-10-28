import type { RandomSource } from "@/application/ports";

/** Gerador mulberry32: rápido, determinístico e suficiente para um jogo. */
export function createSeededRandom(seed: number): RandomSource {
  let state = seed >>> 0;
  return {
    next() {
      state = (state + 0x6d2b79f5) >>> 0;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
  };
}

/** Semente do turno: cada turno tem sua própria sequência, então recarregar a página não muda o resultado. */
export function turnSeed(gameSeed: number, turn: number): number {
  return (gameSeed ^ Math.imul(turn + 1, 0x9e3779b1)) >>> 0;
}

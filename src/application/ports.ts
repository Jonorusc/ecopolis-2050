import type { GameState } from "@/domain/entities/game-state";

/** Fonte de números aleatórios em [0, 1). Injetada para manter o motor determinístico e testável. */
export interface RandomSource {
  next(): number;
}

export interface GameRepository {
  load(): GameState | null;
  save(state: GameState): void;
  clear(): void;
}

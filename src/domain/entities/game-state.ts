import type { EventOutcome } from "../events/climate-event";
import type { Tile } from "./tile";

export const GAME_STATE_VERSION = 1;

export type GamePhase = "playing" | "finished";

export interface TurnRecord {
  readonly year: number;
  /** Emissões anuais da cidade no período (MtCO₂e/ano). */
  readonly annualEmissions: number;
  /** Aquecimento global projetado para 2100 se o mundo seguisse o caminho da cidade (°C). */
  readonly projectedWarming: number;
  readonly event: EventOutcome | null;
}

export interface GameState {
  readonly version: typeof GAME_STATE_VERSION;
  readonly seed: number;
  /** Índice do turno atual, começando em 0. */
  readonly turn: number;
  readonly phase: GamePhase;
  readonly budget: number;
  readonly happiness: number;
  readonly tiles: readonly Tile[];
  readonly adoptedPolicies: readonly string[];
  readonly actionsThisTurn: readonly string[];
  /** Todas as ações já tomadas, na ordem, para o relatório final. */
  readonly actionLog: readonly string[];
  readonly history: readonly TurnRecord[];
}

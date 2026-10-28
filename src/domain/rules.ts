import type { ClimateAction } from "./actions/climate-action";
import type { Tile, TileCatalog } from "./entities/tile";
import type { ClimateEvent } from "./events/climate-event";

export interface GameConfig {
  readonly startYear: number;
  readonly yearsPerTurn: number;
  readonly totalTurns: number;
  readonly maxActionsPerTurn: number;
  readonly initialBudget: number;
  readonly initialHappiness: number;
  readonly baseIncome: number;
  /** Crescimento da demanda por turno (fração), aplicado a lotes que crescem com a cidade. */
  readonly demandGrowthPerTurn: number;
  /** Resiliência máxima alcançável (fração de dano evitada). */
  readonly maxResilience: number;
}

/**
 * Tudo o que o motor do jogo precisa saber sobre o conteúdo.
 * O domínio depende desta abstração; o conteúdo concreto vive em `src/content`.
 */
export interface GameRules {
  readonly config: GameConfig;
  readonly tiles: TileCatalog;
  readonly initialMap: readonly Tile[];
  readonly actions: readonly ClimateAction[];
  readonly events: readonly ClimateEvent[];
}

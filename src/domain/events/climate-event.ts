import type { TileKind } from "../entities/tile";

export interface ClimateEvent {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  /** Peso relativo no sorteio entre eventos. */
  readonly weight: number;
  readonly budgetDamage: number;
  readonly happinessDamage: number;
  /** Lote que o evento destrói (ex.: incêndio transforma floresta em área degradada). */
  readonly destroys?: { readonly from: TileKind; readonly to: TileKind };
}

export interface EventOutcome {
  readonly eventId: string;
  readonly budgetLoss: number;
  readonly happinessLoss: number;
  readonly destroyedTileId: number | null;
  /** Fração do dano evitada graças às ações de adaptação. */
  readonly mitigated: number;
}

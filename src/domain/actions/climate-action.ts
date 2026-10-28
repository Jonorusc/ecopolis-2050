import type { Sector, TileKind } from "../entities/tile";

interface ActionBase {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly cost: number;
  /** Custo recorrente descontado do orçamento a cada turno. */
  readonly upkeep: number;
  readonly happinessDelta: number;
}

/** Transforma um lote do mapa (ex.: termelétrica → usina solar). Pode ser usada várias vezes. */
export interface TileUpgradeAction extends ActionBase {
  readonly type: "tile-upgrade";
  readonly from: readonly TileKind[];
  readonly to: TileKind;
}

/** Política pública aplicada uma única vez, com efeito permanente. */
export interface PolicyAction extends ActionBase {
  readonly type: "policy";
  readonly reductions: readonly SectorReduction[];
  /** Fração (0–1) de dano de eventos climáticos evitada. */
  readonly resilience: number;
  /** Receita extra por turno (ex.: precificação de carbono). */
  readonly incomeDelta: number;
}

export interface SectorReduction {
  readonly sector: Sector | "all";
  /** Fração (0–1) de redução das emissões positivas do setor. */
  readonly fraction: number;
}

export type ClimateAction = TileUpgradeAction | PolicyAction;

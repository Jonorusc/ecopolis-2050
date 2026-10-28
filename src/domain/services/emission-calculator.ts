import type { PolicyAction } from "../actions/climate-action";
import type { Sector, Tile, TileCatalog } from "../entities/tile";

/** Redução máxima que políticas podem aplicar a um único setor. */
const MAX_SECTOR_REDUCTION = 0.8;

export function sectorReductionFactor(sector: Sector, policies: readonly PolicyAction[]): number {
  const remaining = policies
    .flatMap((policy) => policy.reductions)
    .filter((reduction) => reduction.sector === sector || reduction.sector === "all")
    .reduce((factor, reduction) => factor * (1 - reduction.fraction), 1);

  return Math.max(remaining, 1 - MAX_SECTOR_REDUCTION);
}

/**
 * Emissões anuais da cidade (MtCO₂e/ano) em um turno.
 * Demanda crescente e políticas afetam apenas emissões positivas; remoções (florestas) ficam intactas.
 */
export function calculateAnnualEmissions(
  tiles: readonly Tile[],
  catalog: TileCatalog,
  policies: readonly PolicyAction[],
  turn: number,
  demandGrowthPerTurn: number,
): number {
  const demand = 1 + demandGrowthPerTurn * turn;

  return tiles.reduce((total, tile) => {
    const definition = catalog[tile.kind];
    if (definition.emissions <= 0) return total + definition.emissions;

    const growth = definition.growsWithDemand ? demand : 1;
    return total + definition.emissions * growth * sectorReductionFactor(definition.sector, policies);
  }, 0);
}

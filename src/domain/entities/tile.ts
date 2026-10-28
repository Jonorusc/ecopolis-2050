export type Sector = "energy" | "industry" | "transport" | "buildings" | "waste" | "land";

export type TileKind =
  | "coal-plant"
  | "gas-plant"
  | "solar-farm"
  | "wind-farm"
  | "factory"
  | "clean-factory"
  | "housing"
  | "efficient-housing"
  | "car-avenue"
  | "transit-avenue"
  | "landfill"
  | "recycling-center"
  | "degraded-land"
  | "forest"
  | "park";

export interface Tile {
  readonly id: number;
  readonly kind: TileKind;
}

export interface TileDefinition {
  readonly kind: TileKind;
  readonly label: string;
  readonly sector: Sector;
  /** Emissões anuais em MtCO₂e. Valores negativos representam remoção de carbono. */
  readonly emissions: number;
  /** Se as emissões crescem com a demanda da cidade ao longo do tempo. */
  readonly growsWithDemand: boolean;
}

export type TileCatalog = Readonly<Record<TileKind, TileDefinition>>;

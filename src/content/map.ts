import type { Tile, TileKind } from "@/domain/entities/tile";

export const MAP_COLUMNS = 8;

const LEGEND: Readonly<Record<string, TileKind>> = {
  C: "coal-plant",
  G: "gas-plant",
  F: "factory",
  H: "housing",
  A: "car-avenue",
  L: "landfill",
  D: "degraded-land",
  T: "forest",
  P: "park",
};

/** Cada letra é um lote; cada linha, uma faixa do mapa (8 × 6). */
const LAYOUT = [
  "TTDCACGT",
  "TDHHAFFD",
  "HAAAAAAH",
  "HHPHAHHL",
  "DHHTAFHL",
  "TTDPAHDT",
];

export const INITIAL_MAP: readonly Tile[] = LAYOUT.join("")
  .split("")
  .map((code, id) => ({ id, kind: LEGEND[code] }));

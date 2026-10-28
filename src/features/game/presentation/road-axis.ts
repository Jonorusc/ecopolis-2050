import type { Tile, TileKind } from "@/domain/entities/tile";

/** Direção em que uma avenida corre no mapa: ao longo das colunas (u), das linhas (v) ou cruzamento. */
export type RoadAxis = "u" | "v" | "cross";

const ROAD_KINDS: ReadonlySet<TileKind> = new Set(["car-avenue", "transit-avenue"]);

export function roadAxis(tiles: readonly Tile[], index: number, columns: number): RoadAxis {
  const isRoad = (i: number) => i >= 0 && i < tiles.length && ROAD_KINDS.has(tiles[i].kind);
  const column = index % columns;
  const horizontal = (column > 0 && isRoad(index - 1)) || (column < columns - 1 && isRoad(index + 1));
  const vertical = isRoad(index - columns) || isRoad(index + columns);

  if (horizontal && vertical) return "cross";
  return vertical ? "v" : "u";
}

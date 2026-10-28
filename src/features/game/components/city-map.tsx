import type { CSSProperties, KeyboardEvent } from "react";
import type { Tile, TileCatalog } from "@/domain/entities/tile";
import { MAP_COLUMNS } from "@/content/map";
import { formatEmissions } from "../presentation/format";
import { roadAxis } from "../presentation/road-axis";
import { skyColor } from "../presentation/warming-color";
import { mapViewBox, points, quad, tileOrigin } from "./iso/iso-geometry";
import { IsoTileArt } from "./iso/iso-tile-art";
import styles from "./city-map.module.css";

interface CityMapProps {
  readonly tiles: readonly Tile[];
  readonly catalog: TileCatalog;
  readonly risk: number;
  /** Lotes que podem receber a obra selecionada; `null` quando nenhuma obra está selecionada. */
  readonly eligibleTileIds: ReadonlySet<number> | null;
  readonly onTileSelect: (tileId: number) => void;
}

const DIAMOND = quad(0, 0, 1, 1);
const ISLAND_DEPTH = 12;

export function CityMap({ tiles, catalog, risk, eligibleTileIds, onTileSelect }: CityMapProps) {
  const rows = Math.ceil(tiles.length / MAP_COLUMNS);
  const isPicking = eligibleTileIds !== null;
  const placed = tiles.map((tile, index) => ({
    tile,
    index,
    origin: tileOrigin(index % MAP_COLUMNS, Math.floor(index / MAP_COLUMNS), rows),
  }));

  function selectWithKeyboard(event: KeyboardEvent, tileId: number) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onTileSelect(tileId);
  }

  return (
    <section className={styles.city} style={{ "--sky": skyColor(risk), "--haze": risk } as CSSProperties}>
      <span className={styles.sun} aria-hidden="true" />
      <svg
        className={isPicking ? `${styles.map} ${styles.picking}` : styles.map}
        viewBox={mapViewBox(MAP_COLUMNS, rows)}
        role="group"
        aria-label="Mapa da cidade"
      >
        <polygon className={styles.island} points={islandOutline(rows)} aria-hidden="true" />
        {placed.map(({ tile, index, origin: [x, y] }) => {
          const definition = catalog[tile.kind];
          const label = `${definition.label}: ${formatEmissions(definition.emissions)} CO₂ por ano`;
          const isEligible = eligibleTileIds?.has(tile.id) ?? false;
          const art = <IsoTileArt kind={tile.kind} roadAxis={roadAxis(tiles, index, MAP_COLUMNS)} />;

          return isEligible ? (
            <g
              key={tile.id}
              transform={`translate(${x} ${y})`}
              className={`${styles.tile} ${styles.eligible}`}
              role="button"
              tabIndex={0}
              aria-label={`Escolher ${label}`}
              onClick={() => onTileSelect(tile.id)}
              onKeyDown={(event) => selectWithKeyboard(event, tile.id)}
            >
              <title>{label}</title>
              {art}
            </g>
          ) : (
            <g key={tile.id} transform={`translate(${x} ${y})`} className={styles.tile} role="img" aria-label={label}>
              <title>{label}</title>
              {art}
            </g>
          );
        })}
        {/* Contornos por cima de tudo: o lote continua visível mesmo atrás de um prédio alto. */}
        {placed
          .filter(({ tile }) => eligibleTileIds?.has(tile.id))
          .map(({ tile, origin: [x, y] }) => (
            <polygon
              key={tile.id}
              transform={`translate(${x} ${y})`}
              points={DIAMOND}
              className={styles.highlight}
              aria-hidden="true"
            />
          ))}
      </svg>
    </section>
  );
}

/** Borda de terra sob o mapa, que dá volume à "ilha" da cidade. */
function islandOutline(rows: number): string {
  const [rightX, rightY] = tileOrigin(MAP_COLUMNS, 0, rows);
  const [bottomX, bottomY] = tileOrigin(MAP_COLUMNS, rows, rows);
  const [leftX, leftY] = tileOrigin(0, rows, rows);
  return points(
    [leftX, leftY],
    [bottomX, bottomY],
    [rightX, rightY],
    [rightX, rightY + ISLAND_DEPTH],
    [bottomX, bottomY + ISLAND_DEPTH],
    [leftX, leftY + ISLAND_DEPTH],
  );
}

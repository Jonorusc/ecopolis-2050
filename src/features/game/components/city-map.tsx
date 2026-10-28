import type { CSSProperties } from "react";
import type { Tile, TileCatalog } from "@/domain/entities/tile";
import { MAP_COLUMNS } from "@/content/map";
import { formatEmissions } from "../presentation/format";
import { skyColor } from "../presentation/warming-color";
import { TileArt } from "./tile-art";
import styles from "./city-map.module.css";

interface CityMapProps {
  readonly tiles: readonly Tile[];
  readonly catalog: TileCatalog;
  readonly risk: number;
  /** Lotes que podem receber a obra selecionada; `null` quando nenhuma obra está selecionada. */
  readonly eligibleTileIds: ReadonlySet<number> | null;
  readonly onTileSelect: (tileId: number) => void;
}

export function CityMap({ tiles, catalog, risk, eligibleTileIds, onTileSelect }: CityMapProps) {
  const isPicking = eligibleTileIds !== null;

  return (
    <section className={styles.city} style={{ "--sky": skyColor(risk), "--haze": risk } as CSSProperties}>
      <h2 className="visually-hidden">Mapa da cidade</h2>
      <div className={styles.sky} aria-hidden="true">
        <span className={styles.sun} />
      </div>
      <div
        className={isPicking ? `${styles.grid} ${styles.picking}` : styles.grid}
        style={{ gridTemplateColumns: `repeat(${MAP_COLUMNS}, 1fr)` }}
      >
        {tiles.map((tile) => {
          const definition = catalog[tile.kind];
          const label = `${definition.label}: ${formatEmissions(definition.emissions)} CO₂ por ano`;
          const isEligible = eligibleTileIds?.has(tile.id) ?? false;

          return isEligible ? (
            <button
              key={tile.id}
              type="button"
              className={`${styles.tile} ${styles.eligible}`}
              aria-label={`Escolher ${label}`}
              title={label}
              onClick={() => onTileSelect(tile.id)}
            >
              <TileArt kind={tile.kind} />
            </button>
          ) : (
            <div key={tile.id} className={styles.tile} title={label}>
              <TileArt kind={tile.kind} />
              <span className="visually-hidden">{label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

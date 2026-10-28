import type { TileKind } from "@/domain/entities/tile";
import { IsoTileArt } from "./iso/iso-tile-art";

/** Um lote isolado em seu próprio SVG (ex.: prévias da página inicial). */
export function TileThumbnail({ kind }: { readonly kind: TileKind }) {
  return (
    <svg viewBox="-34 -66 68 102" aria-hidden="true" focusable="false">
      <IsoTileArt kind={kind} />
    </svg>
  );
}

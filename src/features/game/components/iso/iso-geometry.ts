/** Metade da largura e da altura do losango de um lote na projeção isométrica (proporção 2:1). */
export const HALF_W = 32;
export const HALF_H = 16;
/** Espaço acima do mapa para prédios altos, fumaça e turbinas. */
export const SKY_MARGIN = 64;
/** Espaço abaixo do mapa para a borda de terra da "ilha". */
const GROUND_MARGIN = 18;

export type Point = readonly [number, number];

/**
 * Converte coordenadas do lote (u, v em 0–1, z em px de altura) para a tela.
 * u cresce para a direita-baixo, v para a esquerda-baixo; o canto (0, 0) é o topo do losango.
 */
export function iso(u: number, v: number, z = 0): Point {
  return [(u - v) * HALF_W, (u + v) * HALF_H - z];
}

export function points(...corners: readonly Point[]): string {
  return corners.map(([x, y]) => `${round(x)},${round(y)}`).join(" ");
}

/** Losango no plano do chão (ou elevado em z) cobrindo [u0, u1] × [v0, v1]. */
export function quad(u0: number, v0: number, u1: number, v1: number, z = 0): string {
  return points(iso(u0, v0, z), iso(u1, v0, z), iso(u1, v1, z), iso(u0, v1, z));
}

/** Elipse no plano do chão, aproximada por um polígono. */
export function groundEllipse(cu: number, cv: number, ru: number, rv: number, z = 0, segments = 20): string {
  return points(
    ...Array.from({ length: segments }, (_, i) => {
      const angle = (i / segments) * Math.PI * 2;
      return iso(cu + Math.cos(angle) * ru, cv + Math.sin(angle) * rv, z);
    }),
  );
}

/** Canto superior de cada lote dentro do SVG do mapa. */
export function tileOrigin(column: number, row: number, rows: number): Point {
  return [(column - row + rows) * HALF_W, (column + row) * HALF_H + SKY_MARGIN];
}

export function mapViewBox(columns: number, rows: number): string {
  const width = (columns + rows) * HALF_W;
  const height = (columns + rows) * HALF_H + SKY_MARGIN + GROUND_MARGIN;
  return `0 0 ${width} ${height}`;
}

/** Escurece uma cor hex para as faces laterais dos volumes. */
export function shade(hex: string, factor: number): string {
  const value = parseInt(hex.slice(1), 16);
  const channel = (shift: number) => Math.round(((value >> shift) & 0xff) * factor);
  return `rgb(${channel(16)} ${channel(8)} ${channel(0)})`;
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

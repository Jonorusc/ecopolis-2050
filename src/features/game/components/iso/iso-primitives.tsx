import { groundEllipse, iso, points, quad, shade } from "./iso-geometry";
import styles from "./iso.module.css";

const LEFT_FACE = 0.72;
const RIGHT_FACE = 0.86;

interface BoxProps {
  readonly u: number;
  readonly v: number;
  readonly du: number;
  readonly dv: number;
  readonly h: number;
  readonly color: string;
  readonly topColor?: string;
  /** Altura da base (para empilhar volumes). */
  readonly z?: number;
}

/** Prisma retangular: só as faces visíveis (frente-esquerda, frente-direita e topo). */
export function Box({ u, v, du, dv, h, color, topColor = color, z = 0 }: BoxProps) {
  const u1 = u + du;
  const v1 = v + dv;
  const top = z + h;
  return (
    <g>
      <polygon points={points(iso(u, v1, z), iso(u1, v1, z), iso(u1, v1, top), iso(u, v1, top))} fill={shade(color, LEFT_FACE)} />
      <polygon points={points(iso(u1, v, z), iso(u1, v1, z), iso(u1, v1, top), iso(u1, v, top))} fill={shade(color, RIGHT_FACE)} />
      <polygon points={quad(u, v, u1, v1, top)} fill={topColor} />
    </g>
  );
}

/** Telhado de quatro águas sobre uma caixa. */
export function Roof({ u, v, du, dv, z, h, color }: Omit<BoxProps, "topColor" | "z"> & { readonly z: number }) {
  const u1 = u + du;
  const v1 = v + dv;
  const apex = iso(u + du / 2, v + dv / 2, z + h);
  return (
    <g>
      <polygon points={points(iso(u, v1, z), iso(u1, v1, z), apex)} fill={shade(color, LEFT_FACE)} />
      <polygon points={points(iso(u1, v, z), iso(u1, v1, z), apex)} fill={shade(color, RIGHT_FACE)} />
    </g>
  );
}

export function Ground({ color }: { readonly color: string }) {
  return <polygon points={quad(0, 0, 1, 1)} fill={color} stroke={shade(color, 0.9)} strokeWidth="0.6" />;
}

export function Tree({ u, v, size = 1, color }: { readonly u: number; readonly v: number; readonly size?: number; readonly color: string }) {
  const [x, y] = iso(u, v);
  const r = 6.5 * size;
  return (
    <g>
      <polygon points={groundEllipse(u + 0.04, v + 0.04, 0.09 * size, 0.09 * size)} fill="rgb(0 0 0 / 14%)" />
      <rect x={x - 1} y={y - 8 * size} width="2" height={8 * size} fill="#6b4a2b" />
      <circle cx={x} cy={y - 10 * size} r={r} fill={color} />
      <circle cx={x - r * 0.35} cy={y - 10 * size - r * 0.35} r={r * 0.45} fill="rgb(255 255 255 / 18%)" />
    </g>
  );
}

/** Fumaça saindo de uma chaminé; anima só se o usuário não pediu menos movimento. */
export function Smoke({ u, v, z, puffs = 3 }: { readonly u: number; readonly v: number; readonly z: number; readonly puffs?: number }) {
  const [x, y] = iso(u, v, z);
  return (
    <g className={styles.smoke}>
      {Array.from({ length: puffs }, (_, i) => (
        <circle key={i} cx={x + i * 4} cy={y - 5 - i * 7} r={4 + i * 2} fill="#7d7f80" opacity={0.7 - i * 0.15} />
      ))}
    </g>
  );
}

export function WindTurbine({ u, v, height, color }: { readonly u: number; readonly v: number; readonly height: number; readonly color: string }) {
  const [x, y] = iso(u, v, height);
  const blade = 14;
  return (
    <g>
      <Box u={u - 0.02} v={v - 0.02} du={0.04} dv={0.04} h={height} color={color} />
      <g transform={`translate(${x} ${y})`}>
        <g className={styles.rotor}>
          {/* Círculo invisível centraliza a caixa de rotação no cubo do rotor. */}
          <circle r={blade} fill="none" />
          {[0, 120, 240].map((angle) => (
            <path key={angle} d={`M0 0L0 ${-blade}`} transform={`rotate(${angle})`} stroke={color} strokeWidth="2.4" strokeLinecap="round" />
          ))}
          <circle r="2" fill={shade(color, 0.8)} />
        </g>
      </g>
    </g>
  );
}

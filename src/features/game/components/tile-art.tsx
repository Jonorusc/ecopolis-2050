import type { ReactNode } from "react";
import type { TileKind } from "@/domain/entities/tile";

/** Paleta das ilustrações dos lotes (arte, não UI: por isso fica aqui e não nos tokens). */
const ART = {
  grass: "#9fcf8a",
  grassDark: "#6faa5c",
  soil: "#c9a274",
  soilDark: "#a37d52",
  asphalt: "#4b555c",
  lane: "#f4f1e6",
  bus: "#d6453a",
  bike: "#3c9b5f",
  concrete: "#b9c1c4",
  concreteDark: "#8d989c",
  roof: "#d9734e",
  roofGreen: "#5aa36a",
  window: "#fdf3c7",
  smoke: "#7d7f80",
  solar: "#2a5d8f",
  solarLine: "#8ab8de",
  turbine: "#f6f8f9",
  tree: "#2f7d46",
  treeLight: "#4d9a5e",
  water: "#6fb7d6",
  trash: "#8a6f4e",
  bin: "#3a8fb7",
} as const;

function Ground({ color }: { color: string }) {
  return <rect width="40" height="40" fill={color} />;
}

function Tree({ x, y, r = 5 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={ART.tree} />
      <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.45} fill={ART.treeLight} />
    </g>
  );
}

function House({ x, y, roof }: { x: number; y: number; roof: string }) {
  return (
    <g>
      <rect x={x} y={y + 4} width="12" height="9" fill={ART.lane} />
      <polygon points={`${x - 1},${y + 5} ${x + 6},${y} ${x + 13},${y + 5}`} fill={roof} />
      <rect x={x + 4.5} y={y + 8} width="3" height="5" fill={ART.concreteDark} />
    </g>
  );
}

function Panels() {
  return (
    <g>
      {[6, 18].map((y) =>
        [4, 14, 24].map((x) => (
          <g key={`${x}-${y}`}>
            <rect x={x} y={y} width="9" height="9" rx="1" fill={ART.solar} />
            <path d={`M${x + 4.5} ${y}v9M${x} ${y + 4.5}h9`} stroke={ART.solarLine} strokeWidth="0.6" />
          </g>
        )),
      )}
    </g>
  );
}

function PowerPlant({ smoke }: { smoke: number }) {
  return (
    <g>
      <rect x="6" y="18" width="20" height="16" fill={ART.concrete} />
      <rect x="28" y="12" width="6" height="22" fill={ART.concreteDark} />
      {Array.from({ length: smoke }, (_, i) => (
        <circle key={i} cx={31 - i * 3} cy={8 - i * 2} r={3 + i} fill={ART.smoke} opacity={0.75 - i * 0.15} />
      ))}
      <rect x="10" y="23" width="4" height="4" fill={ART.window} />
      <rect x="17" y="23" width="4" height="4" fill={ART.window} />
    </g>
  );
}

function Factory({ clean }: { clean: boolean }) {
  return (
    <g>
      <polygon points="4,20 12,14 12,20 20,14 20,20 28,14 28,20 36,20 36,34 4,34" fill={clean ? ART.concrete : ART.concreteDark} />
      {clean ? (
        <rect x="6" y="15" width="20" height="3" fill={ART.solar} transform="rotate(-8 16 16)" />
      ) : (
        <g>
          <rect x="30" y="8" width="4" height="12" fill={ART.asphalt} />
          <circle cx="32" cy="5" r="3" fill={ART.smoke} opacity="0.8" />
        </g>
      )}
      <rect x="9" y="25" width="5" height="5" fill={ART.window} />
      <rect x="20" y="25" width="5" height="5" fill={ART.window} />
    </g>
  );
}

function Avenue({ transit }: { transit: boolean }) {
  return (
    <g>
      <rect y="8" width="40" height="24" fill={ART.asphalt} />
      {transit ? (
        <>
          <rect y="8" width="40" height="7" fill={ART.bus} opacity="0.85" />
          <rect y="26" width="40" height="6" fill={ART.bike} />
          <rect x="8" y="9" width="16" height="5" rx="1.5" fill={ART.lane} />
          <circle cx="30" cy="29" r="1.6" fill="none" stroke={ART.lane} strokeWidth="0.8" />
          <circle cx="35" cy="29" r="1.6" fill="none" stroke={ART.lane} strokeWidth="0.8" />
        </>
      ) : (
        <>
          <path d="M0 20h40" stroke={ART.lane} strokeWidth="1" strokeDasharray="4 3" />
          <rect x="5" y="11" width="8" height="5" rx="1.5" fill={ART.roof} />
          <rect x="24" y="23" width="8" height="5" rx="1.5" fill={ART.solarLine} />
        </>
      )}
    </g>
  );
}

const ARTWORK: Readonly<Record<TileKind, () => ReactNode>> = {
  "coal-plant": () => (
    <>
      <Ground color={ART.soilDark} />
      <PowerPlant smoke={3} />
    </>
  ),
  "gas-plant": () => (
    <>
      <Ground color={ART.soil} />
      <PowerPlant smoke={2} />
    </>
  ),
  "solar-farm": () => (
    <>
      <Ground color={ART.grass} />
      <Panels />
      <rect x="4" y="30" width="32" height="4" fill={ART.grassDark} />
    </>
  ),
  "wind-farm": () => (
    <>
      <Ground color={ART.grass} />
      {[
        [12, 14],
        [28, 22],
      ].map(([x, y]) => (
        <g key={x}>
          <rect x={x - 0.8} y={y} width="1.6" height="16" fill={ART.turbine} />
          <path d={`M${x} ${y}l0 -9M${x} ${y}l8 4M${x} ${y}l-8 4`} stroke={ART.turbine} strokeWidth="1.8" strokeLinecap="round" />
        </g>
      ))}
    </>
  ),
  factory: () => (
    <>
      <Ground color={ART.soil} />
      <Factory clean={false} />
    </>
  ),
  "clean-factory": () => (
    <>
      <Ground color={ART.grass} />
      <Factory clean />
    </>
  ),
  housing: () => (
    <>
      <Ground color={ART.concrete} />
      <House x={4} y={6} roof={ART.roof} />
      <House x={22} y={20} roof={ART.roof} />
    </>
  ),
  "efficient-housing": () => (
    <>
      <Ground color={ART.grass} />
      <House x={4} y={6} roof={ART.roofGreen} />
      <House x={22} y={20} roof={ART.solar} />
      <Tree x={31} y={9} r={4} />
    </>
  ),
  "car-avenue": () => (
    <>
      <Ground color={ART.concrete} />
      <Avenue transit={false} />
    </>
  ),
  "transit-avenue": () => (
    <>
      <Ground color={ART.grass} />
      <Avenue transit />
    </>
  ),
  landfill: () => (
    <>
      <Ground color={ART.soil} />
      <ellipse cx="14" cy="24" rx="11" ry="8" fill={ART.trash} />
      <ellipse cx="28" cy="16" rx="9" ry="6" fill={ART.soilDark} />
      <circle cx="12" cy="10" r="2" fill={ART.smoke} opacity="0.6" />
    </>
  ),
  "recycling-center": () => (
    <>
      <Ground color={ART.grass} />
      <rect x="6" y="14" width="18" height="18" fill={ART.concrete} />
      {[26, 31].map((x) => (
        <rect key={x} x={x} y="20" width="4" height="10" rx="1" fill={ART.bin} />
      ))}
      <circle cx="15" cy="10" r="5" fill={ART.bike} />
    </>
  ),
  "degraded-land": () => (
    <>
      <Ground color={ART.soil} />
      <path d="M6 12l6 4-3 6M24 8l3 7 6 2M14 28l7-2 4 6" stroke={ART.soilDark} strokeWidth="1.2" fill="none" />
    </>
  ),
  forest: () => (
    <>
      <Ground color={ART.grassDark} />
      <Tree x={10} y={11} r={7} />
      <Tree x={28} y={13} r={6} />
      <Tree x={18} y={28} r={8} />
    </>
  ),
  park: () => (
    <>
      <Ground color={ART.grass} />
      <ellipse cx="25" cy="25" rx="10" ry="7" fill={ART.water} />
      <Tree x={10} y={12} r={6} />
      <path d="M2 34Q14 26 22 38" stroke={ART.lane} strokeWidth="2" fill="none" />
    </>
  ),
};

export function TileArt({ kind }: { kind: TileKind }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">
      {ARTWORK[kind]()}
    </svg>
  );
}

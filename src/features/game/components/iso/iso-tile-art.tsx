import type { ReactNode } from "react";
import type { TileKind } from "@/domain/entities/tile";
import type { RoadAxis } from "../../presentation/road-axis";
import { iso, points, quad, groundEllipse } from "./iso-geometry";
import { Box, Ground, Roof, Smoke, Tree, WindTurbine } from "./iso-primitives";

/** Paleta das ilustrações (arte, não UI: por isso fica aqui e não nos tokens). Sempre hex, por causa do `shade`. */
const ART = {
  grass: "#9fcf8a",
  grassDark: "#76b062",
  soil: "#c9a274",
  soilDark: "#a8835a",
  asphalt: "#4b555c",
  lane: "#f4f1e6",
  bus: "#d6453a",
  bike: "#3c9b5f",
  concrete: "#c3cacc",
  concreteDark: "#8d989c",
  wall: "#efe7d6",
  roof: "#d9734e",
  roofGreen: "#5aa36a",
  solar: "#2a5d8f",
  turbine: "#f2f5f6",
  tree: "#2f7d46",
  treeLight: "#4d9a5e",
  water: "#6fb7d6",
  trash: "#8a6f4e",
  binBlue: "#3a8fb7",
  binGreen: "#3c9b5f",
  carRed: "#d9734e",
  carBlue: "#5b8fc9",
} as const;

/** Faixa ao longo da via: `from`–`to` medidos no sentido transversal à via. */
function band(axis: Exclude<RoadAxis, "cross">, from: number, to: number): string {
  return axis === "u" ? quad(0, from, 1, to) : quad(from, 0, to, 1);
}

function Avenue({ axis, transit }: { readonly axis: RoadAxis; readonly transit: boolean }) {
  const along = axis === "cross" ? "u" : axis;
  const center =
    along === "u" ? points(iso(0, 0.5), iso(1, 0.5)) : points(iso(0.5, 0), iso(0.5, 1));
  const car = (offset: number, across: number, color: string, length = 0.22) =>
    along === "u" ? (
      <Box u={offset} v={across} du={length} dv={0.16} h={5} color={color} />
    ) : (
      <Box u={across} v={offset} du={0.16} dv={length} h={5} color={color} />
    );

  return (
    <>
      <Ground color={ART.asphalt} />
      {transit ? (
        <>
          <polygon points={band(along, 0.06, 0.34)} fill={ART.bus} opacity="0.85" />
          <polygon points={band(along, 0.74, 0.94)} fill={ART.bike} />
          {car(0.25, 0.12, ART.bus, 0.5)}
        </>
      ) : (
        <>
          {axis === "cross" ? (
            <polygon points={quad(0.3, 0.3, 0.7, 0.7)} fill="none" stroke={ART.lane} strokeWidth="1" strokeDasharray="3 2" />
          ) : (
            <polyline points={center} stroke={ART.lane} strokeWidth="1.2" strokeDasharray="5 4" fill="none" />
          )}
          {car(0.15, 0.22, ART.carRed)}
          {car(0.6, 0.6, ART.carBlue)}
        </>
      )}
    </>
  );
}

function Houses({ roof, efficient }: { readonly roof: string; readonly efficient: boolean }) {
  const lots = [
    { u: 0.12, v: 0.14 },
    { u: 0.56, v: 0.2 },
    { u: 0.2, v: 0.58 },
    { u: 0.6, v: 0.6 },
  ];
  return (
    <>
      <Ground color={efficient ? ART.grass : ART.concrete} />
      {lots.map((lot) => (
        <g key={`${lot.u}-${lot.v}`}>
          <Box u={lot.u} v={lot.v} du={0.28} dv={0.26} h={9} color={ART.wall} />
          <Roof u={lot.u} v={lot.v} du={0.28} dv={0.26} z={9} h={6} color={roof} />
        </g>
      ))}
    </>
  );
}

function PowerPlant({ ground, puffs }: { readonly ground: string; readonly puffs: number }) {
  return (
    <>
      <Ground color={ground} />
      <Box u={0.12} v={0.4} du={0.5} dv={0.45} h={16} color={ART.concrete} />
      <Box u={0.68} v={0.16} du={0.16} dv={0.16} h={38} color={ART.concreteDark} />
      <Smoke u={0.76} v={0.24} z={38} puffs={puffs} />
    </>
  );
}

function Factory({ clean }: { readonly clean: boolean }) {
  return (
    <>
      <Ground color={clean ? ART.grass : ART.soil} />
      <Box u={0.1} v={0.3} du={0.62} dv={0.55} h={14} color={ART.concrete} topColor={clean ? ART.solar : undefined} />
      {clean ? (
        <Tree u={0.85} v={0.2} size={0.8} color={ART.treeLight} />
      ) : (
        <>
          <Box u={0.74} v={0.12} du={0.12} dv={0.12} h={30} color={ART.concreteDark} />
          <Smoke u={0.8} v={0.18} z={30} puffs={2} />
        </>
      )}
    </>
  );
}

function SolarFarm() {
  const rows = [0.12, 0.42, 0.72];
  return (
    <>
      <Ground color={ART.grass} />
      {rows.map((v) =>
        [0.1, 0.55].map((u) => <Box key={`${u}-${v}`} u={u} v={v} du={0.36} dv={0.18} h={3} z={2} color={ART.concreteDark} topColor={ART.solar} />),
      )}
    </>
  );
}

function Landfill() {
  return (
    <>
      <Ground color={ART.soil} />
      <polygon points={groundEllipse(0.38, 0.6, 0.3, 0.22)} fill={ART.trash} />
      <polygon points={groundEllipse(0.38, 0.6, 0.18, 0.12, 6)} fill={ART.soilDark} />
      <polygon points={groundEllipse(0.7, 0.3, 0.2, 0.16)} fill={ART.soilDark} />
    </>
  );
}

function RecyclingCenter() {
  return (
    <>
      <Ground color={ART.grass} />
      <Box u={0.1} v={0.12} du={0.5} dv={0.45} h={13} color={ART.concrete} topColor={ART.bike} />
      <Box u={0.68} v={0.55} du={0.12} dv={0.12} h={7} color={ART.binBlue} />
      <Box u={0.68} v={0.75} du={0.12} dv={0.12} h={7} color={ART.binGreen} />
      <Box u={0.45} v={0.72} du={0.12} dv={0.12} h={7} color={ART.roof} />
    </>
  );
}

function DegradedLand() {
  return (
    <>
      <Ground color={ART.soil} />
      <polyline points={points(iso(0.2, 0.2), iso(0.35, 0.35), iso(0.3, 0.55))} stroke={ART.soilDark} strokeWidth="1" fill="none" />
      <polyline points={points(iso(0.6, 0.2), iso(0.7, 0.45), iso(0.85, 0.5))} stroke={ART.soilDark} strokeWidth="1" fill="none" />
      <polyline points={points(iso(0.4, 0.75), iso(0.6, 0.7), iso(0.7, 0.85))} stroke={ART.soilDark} strokeWidth="1" fill="none" />
    </>
  );
}

function Forest() {
  const trees = [
    [0.2, 0.2, 1],
    [0.65, 0.18, 0.9],
    [0.4, 0.45, 1.15],
    [0.82, 0.55, 0.95],
    [0.22, 0.75, 0.9],
    [0.6, 0.8, 1.05],
  ] as const;
  return (
    <>
      <Ground color={ART.grassDark} />
      {[...trees]
        .sort(([ua, va], [ub, vb]) => ua + va - (ub + vb))
        .map(([u, v, size]) => (
          <Tree key={`${u}-${v}`} u={u} v={v} size={size} color={ART.tree} />
        ))}
    </>
  );
}

function Park() {
  return (
    <>
      <Ground color={ART.grass} />
      <polygon points={groundEllipse(0.6, 0.6, 0.24, 0.2)} fill={ART.water} />
      <polyline points={points(iso(0, 0.3), iso(0.35, 0.4), iso(0.45, 1))} stroke={ART.lane} strokeWidth="2" fill="none" />
      <Tree u={0.22} v={0.15} color={ART.treeLight} />
      <Tree u={0.75} v={0.2} size={0.8} color={ART.tree} />
    </>
  );
}

interface IsoTileArtProps {
  readonly kind: TileKind;
  readonly roadAxis?: RoadAxis;
}

/** Desenho de um lote com o canto superior do losango na origem (0, 0). */
export function IsoTileArt({ kind, roadAxis = "u" }: IsoTileArtProps): ReactNode {
  switch (kind) {
    case "coal-plant":
      return <PowerPlant ground={ART.soilDark} puffs={3} />;
    case "gas-plant":
      return <PowerPlant ground={ART.soil} puffs={2} />;
    case "solar-farm":
      return <SolarFarm />;
    case "wind-farm":
      return (
        <>
          <Ground color={ART.grass} />
          <WindTurbine u={0.3} v={0.35} height={44} color={ART.turbine} />
          <WindTurbine u={0.72} v={0.7} height={40} color={ART.turbine} />
        </>
      );
    case "factory":
      return <Factory clean={false} />;
    case "clean-factory":
      return <Factory clean />;
    case "housing":
      return <Houses roof={ART.roof} efficient={false} />;
    case "efficient-housing":
      return <Houses roof={ART.roofGreen} efficient />;
    case "car-avenue":
      return <Avenue axis={roadAxis} transit={false} />;
    case "transit-avenue":
      return <Avenue axis={roadAxis} transit />;
    case "landfill":
      return <Landfill />;
    case "recycling-center":
      return <RecyclingCenter />;
    case "degraded-land":
      return <DegradedLand />;
    case "forest":
      return <Forest />;
    case "park":
      return <Park />;
  }
}

import type { ActionBlocker } from "@/application/use-cases/apply-action";
import type { ClimateAction } from "@/domain/actions/climate-action";
import type { Sector, TileCatalog } from "@/domain/entities/tile";

const decimal = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const fineDecimal = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 2 });
const integer = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });

/** Valores pequenos (por lote) ganham uma casa extra para não virarem "0,1". */
export const formatEmissions = (value: number) =>
  `${(Math.abs(value) < 1 ? fineDecimal : decimal).format(value)} Mt`;
export const formatWarming = (value: number) => `${decimal.format(value)} °C`;
export const formatMoney = (value: number) => `R$ ${integer.format(value)} mi`;
export const formatPercent = (fraction: number) => `${integer.format(fraction * 100)}%`;

export const SECTOR_LABELS: Readonly<Record<Sector | "all", string>> = {
  energy: "energia",
  industry: "indústria",
  transport: "transporte",
  buildings: "edificações",
  waste: "resíduos",
  land: "uso da terra",
  all: "todos os setores",
};

export const BLOCKER_MESSAGES: Readonly<Record<ActionBlocker, string>> = {
  "game-finished": "O mandato acabou.",
  "unknown-action": "Ação desconhecida.",
  "turn-limit-reached": "Você já usou todas as ações deste turno. Encerre o turno para continuar.",
  "insufficient-budget": "Falta orçamento. Encerre o turno para receber mais recursos.",
  "policy-already-adopted": "Política já adotada.",
  "no-eligible-tile": "Não há mais lotes onde essa obra possa ser feita.",
  "invalid-tile": "Esse lote não serve para essa obra. Escolha um lote destacado.",
};

/** Texto curto dos efeitos de uma ação, para os chips do card. */
export function describeEffects(action: ClimateAction, tiles: TileCatalog): string[] {
  const effects: string[] = [];
  if (action.type === "tile-upgrade") {
    const biggestCut = Math.max(...action.from.map((kind) => tiles[kind].emissions - tiles[action.to].emissions));
    effects.push(`até −${formatEmissions(biggestCut)} CO₂/ano`);
  }
  if (action.type === "policy") {
    for (const reduction of action.reductions) {
      effects.push(`−${formatPercent(reduction.fraction)} CO₂ em ${SECTOR_LABELS[reduction.sector]}`);
    }
    if (action.resilience > 0) effects.push(`−${formatPercent(action.resilience)} dano de desastres`);
    if (action.incomeDelta > 0) effects.push(`+${formatMoney(action.incomeDelta)}/turno`);
  }
  if (action.happinessDelta !== 0) {
    effects.push(`${action.happinessDelta > 0 ? "+" : "−"}${Math.abs(action.happinessDelta)} bem-estar`);
  }
  if (action.upkeep > 0) effects.push(`manutenção ${formatMoney(action.upkeep)}/turno`);
  return effects;
}

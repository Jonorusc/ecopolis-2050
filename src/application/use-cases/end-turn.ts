import type { GameState, TurnRecord } from "@/domain/entities/game-state";
import type { ClimateEvent, EventOutcome } from "@/domain/events/climate-event";
import type { GameRules } from "@/domain/rules";
import { calculateAnnualEmissions } from "@/domain/services/emission-calculator";
import { climateRisk, projectWarming } from "@/domain/services/climate-projection";
import {
  adoptedPolicies,
  currentYear,
  policyIncome,
  totalResilience,
  totalUpkeep,
} from "@/domain/services/rules-queries";
import type { RandomSource } from "../ports";
import { clampHappiness } from "./apply-action";

const BASE_EVENT_CHANCE = 0.15;
const RISK_EVENT_CHANCE = 0.6;
/** Abaixo desta razão de emissões o ar fica mais limpo e a população mais feliz. */
const CLEAN_AIR_RATIO = 0.5;
const HAPPINESS_PER_INCOME_POINT = 5;

export interface EndTurnResult {
  readonly state: GameState;
  readonly event: EventOutcome | null;
}

export function initialEmissions(rules: GameRules): number {
  return calculateAnnualEmissions(rules.initialMap, rules.tiles, [], 0, rules.config.demandGrowthPerTurn);
}

export function endTurn(state: GameState, rules: GameRules, random: RandomSource): EndTurnResult {
  if (state.phase !== "playing") return { state, event: null };

  const baseline = initialEmissions(rules);
  const annualEmissions = calculateAnnualEmissions(
    state.tiles,
    rules.tiles,
    adoptedPolicies(state, rules),
    state.turn,
    rules.config.demandGrowthPerTurn,
  );
  const emissionHistory = [...state.history.map((record) => record.annualEmissions), annualEmissions];
  const projectedWarming = projectWarming(emissionHistory, baseline);

  const rolled = rollEvent(state, rules, random, climateRisk(projectedWarming));
  const event = rolled?.outcome ?? null;
  const afterEvent = rolled ? applyEvent(state, rolled.event, rolled.outcome) : state;

  const emissionRatio = annualEmissions / baseline;
  const airQualityDelta = emissionRatio < CLEAN_AIR_RATIO ? 2 : emissionRatio > 1 ? -2 : 0;
  const income =
    rules.config.baseIncome +
    Math.round(afterEvent.happiness / HAPPINESS_PER_INCOME_POINT) +
    policyIncome(state, rules) -
    totalUpkeep(state, rules);

  const record: TurnRecord = { year: currentYear(state, rules), annualEmissions, projectedWarming, event };
  const nextTurn = state.turn + 1;

  return {
    event,
    state: {
      ...afterEvent,
      turn: nextTurn,
      phase: nextTurn >= rules.config.totalTurns ? "finished" : "playing",
      budget: afterEvent.budget + income,
      happiness: clampHappiness(afterEvent.happiness + airQualityDelta),
      actionsThisTurn: [],
      history: [...state.history, record],
    },
  };
}

interface RolledEvent {
  readonly event: ClimateEvent;
  readonly outcome: EventOutcome;
}

function rollEvent(state: GameState, rules: GameRules, random: RandomSource, risk: number): RolledEvent | null {
  const chance = BASE_EVENT_CHANCE + RISK_EVENT_CHANCE * risk;
  if (random.next() >= chance || rules.events.length === 0) return null;

  const event = pickWeighted(rules.events, random.next());
  const mitigated = totalResilience(state, rules);
  const destroyedTile = event.destroys ? state.tiles.find((tile) => tile.kind === event.destroys?.from) : undefined;

  return {
    event,
    outcome: {
      eventId: event.id,
      budgetLoss: Math.round(event.budgetDamage * (1 - mitigated)),
      happinessLoss: Math.round(event.happinessDamage * (1 - mitigated)),
      destroyedTileId: destroyedTile?.id ?? null,
      mitigated,
    },
  };
}

function pickWeighted(events: readonly ClimateEvent[], roll: number): ClimateEvent {
  const totalWeight = events.reduce((sum, event) => sum + event.weight, 0);
  let threshold = roll * totalWeight;
  for (const event of events) {
    threshold -= event.weight;
    if (threshold < 0) return event;
  }
  return events[events.length - 1];
}

function applyEvent(state: GameState, event: ClimateEvent, outcome: EventOutcome): GameState {
  const destroyedBecomes = event.destroys?.to;
  return {
    ...state,
    budget: state.budget - outcome.budgetLoss,
    happiness: clampHappiness(state.happiness - outcome.happinessLoss),
    tiles: state.tiles.map((tile) =>
      tile.id === outcome.destroyedTileId && destroyedBecomes ? { ...tile, kind: destroyedBecomes } : tile,
    ),
  };
}

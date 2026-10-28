import type { GameState } from "@/domain/entities/game-state";
import type { GameRules } from "@/domain/rules";
import { calculateAnnualEmissions } from "@/domain/services/emission-calculator";
import { projectWarming } from "@/domain/services/climate-projection";
import { gradeFor, type Grade } from "@/domain/services/score-evaluator";
import { initialEmissions } from "./end-turn";

export interface ActionTally {
  readonly actionId: string;
  readonly count: number;
}

export interface GameOutcome {
  readonly grade: Grade;
  readonly projectedWarming: number;
  /** Warming do cenário em que nada muda, para comparação. */
  readonly baselineWarming: number;
  /** CO₂ emitido durante o jogo (MtCO₂e). */
  readonly cumulativeEmissions: number;
  readonly baselineCumulativeEmissions: number;
  readonly avoidedEmissions: number;
  readonly finalHappiness: number;
  readonly finalBudget: number;
  readonly actions: readonly ActionTally[];
}

export function evaluateOutcome(state: GameState, rules: GameRules): GameOutcome {
  const { yearsPerTurn, totalTurns, demandGrowthPerTurn } = rules.config;
  const baseline = initialEmissions(rules);

  const playedEmissions = state.history.map((record) => record.annualEmissions);
  const baselineEmissions = Array.from({ length: totalTurns }, (_, turn) =>
    calculateAnnualEmissions(rules.initialMap, rules.tiles, [], turn, demandGrowthPerTurn),
  );

  const cumulativeEmissions = sum(playedEmissions) * yearsPerTurn;
  const baselineCumulativeEmissions = sum(baselineEmissions) * yearsPerTurn;
  const projectedWarming = projectWarming(playedEmissions, baseline);

  return {
    grade: gradeFor(projectedWarming),
    projectedWarming,
    baselineWarming: projectWarming(baselineEmissions, baseline),
    cumulativeEmissions,
    baselineCumulativeEmissions,
    avoidedEmissions: baselineCumulativeEmissions - cumulativeEmissions,
    finalHappiness: state.happiness,
    finalBudget: state.budget,
    actions: tally(state.actionLog),
  };
}

function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function tally(actionLog: readonly string[]): ActionTally[] {
  const counts = new Map<string, number>();
  for (const actionId of actionLog) counts.set(actionId, (counts.get(actionId) ?? 0) + 1);
  return [...counts].map(([actionId, count]) => ({ actionId, count }));
}

import type { GameState } from "@/domain/entities/game-state";
import type { GameRules } from "@/domain/rules";
import { calculateAnnualEmissions } from "@/domain/services/emission-calculator";
import { climateRisk, projectWarming } from "@/domain/services/climate-projection";
import { adoptedPolicies, currentYear, policyIncome, totalResilience, totalUpkeep } from "@/domain/services/rules-queries";
import { initialEmissions } from "../use-cases/end-turn";

export interface LiveIndicators {
  readonly year: number;
  /** Emissões anuais com as decisões já tomadas neste turno (MtCO₂e/ano). */
  readonly annualEmissions: number;
  readonly initialEmissions: number;
  readonly projectedWarming: number;
  /** 0 = céu limpo, 1 = cenário de alto risco. */
  readonly risk: number;
  readonly resilience: number;
  readonly upkeep: number;
  readonly policyIncome: number;
  readonly actionsLeft: number;
}

/** Indicadores do turno atual, recalculados a cada decisão para dar feedback imediato. */
export function getLiveIndicators(state: GameState, rules: GameRules): LiveIndicators {
  const baseline = initialEmissions(rules);
  const turn = Math.min(state.turn, rules.config.totalTurns - 1);
  const annualEmissions =
    state.phase === "finished"
      ? (state.history.at(-1)?.annualEmissions ?? baseline)
      : calculateAnnualEmissions(
          state.tiles,
          rules.tiles,
          adoptedPolicies(state, rules),
          turn,
          rules.config.demandGrowthPerTurn,
        );

  const history = state.history.map((record) => record.annualEmissions);
  const projectedWarming =
    state.phase === "finished"
      ? projectWarming(history, baseline)
      : projectWarming([...history, annualEmissions], baseline);

  return {
    year: currentYear(state, rules),
    annualEmissions,
    initialEmissions: baseline,
    projectedWarming,
    risk: climateRisk(projectedWarming),
    resilience: totalResilience(state, rules),
    upkeep: totalUpkeep(state, rules),
    policyIncome: policyIncome(state, rules),
    actionsLeft: Math.max(rules.config.maxActionsPerTurn - state.actionsThisTurn.length, 0),
  };
}

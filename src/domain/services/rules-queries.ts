import type { ClimateAction, PolicyAction } from "../actions/climate-action";
import type { GameState } from "../entities/game-state";
import type { GameRules } from "../rules";

export function findAction(rules: GameRules, actionId: string): ClimateAction | undefined {
  return rules.actions.find((action) => action.id === actionId);
}

export function adoptedPolicies(state: GameState, rules: GameRules): PolicyAction[] {
  return rules.actions.filter(
    (action): action is PolicyAction => action.type === "policy" && state.adoptedPolicies.includes(action.id),
  );
}

export function currentYear(state: GameState, rules: GameRules): number {
  return rules.config.startYear + state.turn * rules.config.yearsPerTurn;
}

/** Soma do custo de manutenção de tudo o que a cidade já construiu ou adotou. */
export function totalUpkeep(state: GameState, rules: GameRules): number {
  return state.actionLog.reduce((sum, actionId) => sum + (findAction(rules, actionId)?.upkeep ?? 0), 0);
}

export function totalResilience(state: GameState, rules: GameRules): number {
  const resilience = adoptedPolicies(state, rules).reduce((sum, policy) => sum + policy.resilience, 0);
  return Math.min(resilience, rules.config.maxResilience);
}

export function policyIncome(state: GameState, rules: GameRules): number {
  return adoptedPolicies(state, rules).reduce((sum, policy) => sum + policy.incomeDelta, 0);
}

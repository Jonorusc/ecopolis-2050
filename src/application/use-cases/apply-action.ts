import type { ClimateAction } from "@/domain/actions/climate-action";
import type { GameState } from "@/domain/entities/game-state";
import type { GameRules } from "@/domain/rules";
import { findAction } from "@/domain/services/rules-queries";

export type ActionBlocker =
  | "game-finished"
  | "unknown-action"
  | "turn-limit-reached"
  | "insufficient-budget"
  | "policy-already-adopted"
  | "no-eligible-tile"
  | "invalid-tile";

export type ApplyActionResult =
  | { readonly ok: true; readonly state: GameState }
  | { readonly ok: false; readonly reason: ActionBlocker };

/** Por que uma ação não pode ser usada agora (sem considerar um lote específico), ou `null`. */
export function getActionBlocker(state: GameState, rules: GameRules, action: ClimateAction): ActionBlocker | null {
  if (state.phase !== "playing") return "game-finished";
  if (state.actionsThisTurn.length >= rules.config.maxActionsPerTurn) return "turn-limit-reached";
  if (action.type === "policy" && state.adoptedPolicies.includes(action.id)) return "policy-already-adopted";
  if (state.budget < action.cost) return "insufficient-budget";
  if (action.type === "tile-upgrade" && eligibleTileIds(state, action).length === 0) return "no-eligible-tile";
  return null;
}

export function eligibleTileIds(state: GameState, action: ClimateAction): number[] {
  if (action.type !== "tile-upgrade") return [];
  return state.tiles.filter((tile) => action.from.includes(tile.kind)).map((tile) => tile.id);
}

export function applyAction(
  state: GameState,
  rules: GameRules,
  actionId: string,
  tileId?: number,
): ApplyActionResult {
  const action = findAction(rules, actionId);
  if (!action) return { ok: false, reason: "unknown-action" };

  const blocker = getActionBlocker(state, rules, action);
  if (blocker) return { ok: false, reason: blocker };

  const paid: GameState = {
    ...state,
    budget: state.budget - action.cost,
    happiness: clampHappiness(state.happiness + action.happinessDelta),
    actionsThisTurn: [...state.actionsThisTurn, action.id],
    actionLog: [...state.actionLog, action.id],
  };

  if (action.type === "policy") {
    return { ok: true, state: { ...paid, adoptedPolicies: [...state.adoptedPolicies, action.id] } };
  }

  if (tileId === undefined || !eligibleTileIds(state, action).includes(tileId)) {
    return { ok: false, reason: "invalid-tile" };
  }

  const tiles = state.tiles.map((tile) => (tile.id === tileId ? { ...tile, kind: action.to } : tile));
  return { ok: true, state: { ...paid, tiles } };
}

export function clampHappiness(value: number): number {
  return Math.min(Math.max(Math.round(value), 0), 100);
}

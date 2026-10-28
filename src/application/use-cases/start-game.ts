import { GAME_STATE_VERSION, type GameState } from "@/domain/entities/game-state";
import type { GameRules } from "@/domain/rules";

export function startGame(rules: GameRules, seed: number): GameState {
  return {
    version: GAME_STATE_VERSION,
    seed,
    turn: 0,
    phase: "playing",
    budget: rules.config.initialBudget,
    happiness: rules.config.initialHappiness,
    tiles: rules.initialMap,
    adoptedPolicies: [],
    actionsThisTurn: [],
    actionLog: [],
    history: [],
  };
}

import type { GameRules } from "@/domain/rules";
import { ACTIONS } from "./actions";
import { EVENTS } from "./events";
import { INITIAL_MAP } from "./map";
import { TILE_CATALOG } from "./tiles";

export const GAME_RULES: GameRules = {
  config: {
    startYear: 2026,
    yearsPerTurn: 2,
    totalTurns: 12,
    maxActionsPerTurn: 3,
    initialBudget: 120,
    initialHappiness: 55,
    baseIncome: 75,
    demandGrowthPerTurn: 0.025,
    maxResilience: 0.7,
  },
  tiles: TILE_CATALOG,
  initialMap: INITIAL_MAP,
  actions: ACTIONS,
  events: EVENTS,
};

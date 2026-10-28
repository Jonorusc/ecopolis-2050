import { describe, expect, it } from "vitest";
import { GAME_RULES } from "@/content/rules";
import type { ClimateAction } from "@/domain/actions/climate-action";
import type { GameState } from "@/domain/entities/game-state";
import type { RandomSource } from "../ports";
import { applyAction, getActionBlocker, eligibleTileIds } from "./apply-action";
import { endTurn, initialEmissions } from "./end-turn";
import { evaluateOutcome } from "./evaluate-outcome";
import { startGame } from "./start-game";
import { createSeededRandom, turnSeed } from "@/infrastructure/seeded-random";

const neverEvents: RandomSource = { next: () => 0.99 };
const alwaysEvents: RandomSource = { next: () => 0 };

function playToEnd(state: GameState, chooseActions: (state: GameState) => GameState, random?: RandomSource) {
  let current = state;
  while (current.phase === "playing") {
    current = chooseActions(current);
    current = endTurn(current, GAME_RULES, random ?? createSeededRandom(turnSeed(current.seed, current.turn))).state;
  }
  return current;
}

/** Lote elegível que mais emite e que a ação de fato melhora. */
function dirtiest(state: GameState, action: ClimateAction): number | undefined {
  return eligibleTileIds(state, action)
    .map((id) => state.tiles[id])
    .sort((a, b) => GAME_RULES.tiles[b.kind].emissions - GAME_RULES.tiles[a.kind].emissions)
    .filter((tile) => action.type !== "tile-upgrade" || GAME_RULES.tiles[tile.kind].emissions > GAME_RULES.tiles[action.to].emissions)[0]?.id;
}

/** Estratégia gananciosa: sempre a ação acessível que mais corta emissões por real gasto. */
function greenStrategy(state: GameState): GameState {
  let current = state;
  const priority = [
    "carbon-price",
    "climate-education",
    "selective-collection",
    "green-building-code",
    "solar-farm",
    "wind-farm",
    "free-transit",
    "transit-corridor",
    "recycling-center",
    "clean-industry",
    "reforestation",
    "housing-retrofit",
    "drainage",
    "heat-plan",
  ];
  for (let slot = 0; slot < GAME_RULES.config.maxActionsPerTurn; slot++) {
    for (const actionId of priority) {
      const action = GAME_RULES.actions.find((candidate) => candidate.id === actionId)!;
      if (getActionBlocker(current, GAME_RULES, action)) continue;
      const tileId = dirtiest(current, action);
      if (action.type === "tile-upgrade" && tileId === undefined) continue;
      const result = applyAction(current, GAME_RULES, actionId, tileId);
      if (result.ok) {
        current = result.state;
        break;
      }
    }
  }
  return current;
}

describe("map", () => {
  it("has 48 tiles with sequential ids", () => {
    expect(GAME_RULES.initialMap).toHaveLength(48);
    GAME_RULES.initialMap.forEach((tile, index) => expect(tile.id).toBe(index));
  });

  it("starts around 13 MtCO₂e per year", () => {
    expect(initialEmissions(GAME_RULES)).toBeCloseTo(13.2, 1);
  });
});

describe("applyAction", () => {
  const game = startGame(GAME_RULES, 1);

  it("converts a tile and charges the cost", () => {
    const coal = game.tiles.find((tile) => tile.kind === "coal-plant")!;
    const result = applyAction(game, GAME_RULES, "solar-farm", coal.id);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.tiles[coal.id].kind).toBe("solar-farm");
    expect(result.state.budget).toBe(game.budget - 55);
  });

  it("rejects a tile the action does not apply to", () => {
    const house = game.tiles.find((tile) => tile.kind === "housing")!;
    expect(applyAction(game, GAME_RULES, "solar-farm", house.id)).toEqual({ ok: false, reason: "invalid-tile" });
  });

  it("does not adopt the same policy twice", () => {
    const once = applyAction(game, GAME_RULES, "climate-education");
    if (!once.ok) throw new Error("expected success");
    expect(applyAction(once.state, GAME_RULES, "climate-education")).toEqual({
      ok: false,
      reason: "policy-already-adopted",
    });
  });

  it("blocks actions the budget cannot pay for", () => {
    const broke = { ...game, budget: 5 };
    expect(applyAction(broke, GAME_RULES, "climate-education")).toEqual({ ok: false, reason: "insufficient-budget" });
  });

  it("limits the number of actions per turn", () => {
    const busy = { ...game, actionsThisTurn: ["a", "b", "c"] };
    expect(applyAction(busy, GAME_RULES, "climate-education")).toEqual({ ok: false, reason: "turn-limit-reached" });
  });
});

describe("endTurn", () => {
  it("advances the year, records emissions and pays income", () => {
    const game = startGame(GAME_RULES, 1);
    const { state, event } = endTurn(game, GAME_RULES, neverEvents);
    expect(event).toBeNull();
    expect(state.turn).toBe(1);
    expect(state.history[0].year).toBe(2026);
    expect(state.budget).toBeGreaterThan(game.budget);
  });

  it("reduces event damage with adaptation policies", () => {
    const exposed = startGame(GAME_RULES, 1);
    const adapted = { ...exposed, adoptedPolicies: ["drainage", "heat-plan"] };
    const exposedEvent = endTurn(exposed, GAME_RULES, alwaysEvents).event!;
    const adaptedEvent = endTurn(adapted, GAME_RULES, alwaysEvents).event!;
    expect(adaptedEvent.budgetLoss).toBeLessThan(exposedEvent.budgetLoss);
  });

  it("finishes the game after the last turn", () => {
    const finished = playToEnd(startGame(GAME_RULES, 1), (state) => state, neverEvents);
    expect(finished.phase).toBe("finished");
    expect(finished.history).toHaveLength(GAME_RULES.config.totalTurns);
    expect(finished.history.at(-1)?.year).toBe(2048);
  });
});

describe("balance", () => {
  it("doing nothing leads to the worst grade", () => {
    const outcome = evaluateOutcome(playToEnd(startGame(GAME_RULES, 7), (state) => state), GAME_RULES);
    expect(outcome.grade).toBe("E");
  });

  it.each([1, 2, 3, 42, 2026])("a committed green strategy reaches grade A or B (seed %i)", (seed) => {
    const outcome = evaluateOutcome(playToEnd(startGame(GAME_RULES, seed), greenStrategy), GAME_RULES);
    expect(["A", "B"]).toContain(outcome.grade);
    expect(outcome.avoidedEmissions).toBeGreaterThan(0);
  });
});

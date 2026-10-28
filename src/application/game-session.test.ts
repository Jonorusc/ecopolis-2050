import { describe, expect, it, vi } from "vitest";
import { GAME_RULES } from "@/content/rules";
import type { GameState } from "@/domain/entities/game-state";
import { createGameSession } from "./game-session";
import type { GameRepository } from "./ports";

function memoryRepository(initial: GameState | null = null): GameRepository & { saved: GameState | null } {
  return {
    saved: initial,
    load() {
      return this.saved;
    },
    save(state) {
      this.saved = state;
    },
    clear() {
      this.saved = null;
    },
  };
}

function session(repository = memoryRepository()) {
  return createGameSession({
    rules: GAME_RULES,
    repository,
    randomForTurn: () => ({ next: () => 0.99 }),
    newSeed: () => 123,
  });
}

describe("game session", () => {
  it("starts a new game when nothing is saved", () => {
    expect(session().getSnapshot().game.seed).toBe(123);
  });

  it("resumes a saved game", () => {
    const repository = memoryRepository();
    const first = session(repository);
    first.endTurn();
    expect(session(repository).getSnapshot().game.turn).toBe(1);
  });

  it("discards saves with tiles the current rules do not know", () => {
    const repository = memoryRepository();
    session(repository).endTurn();
    repository.saved = { ...repository.saved!, seed: 999, tiles: [{ id: 0, kind: "volcano" as never }] };
    expect(session(repository).getSnapshot().game.seed).toBe(123);
  });

  it("notifies subscribers and keeps the snapshot stable between changes", () => {
    const game = session();
    const listener = vi.fn();
    game.subscribe(listener);
    const before = game.getSnapshot();
    expect(game.getSnapshot()).toBe(before);
    game.applyAction("climate-education");
    expect(listener).toHaveBeenCalledOnce();
    expect(game.getSnapshot()).not.toBe(before);
  });

  it("does not notify when an action is rejected", () => {
    const game = session();
    const listener = vi.fn();
    game.subscribe(listener);
    expect(game.applyAction("does-not-exist").ok).toBe(false);
    expect(listener).not.toHaveBeenCalled();
  });
});

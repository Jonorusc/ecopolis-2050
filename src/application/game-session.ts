import type { GameState } from "@/domain/entities/game-state";
import type { EventOutcome } from "@/domain/events/climate-event";
import type { GameRules } from "@/domain/rules";
import type { GameRepository, RandomSource } from "./ports";
import { applyAction, type ApplyActionResult } from "./use-cases/apply-action";
import { endTurn } from "./use-cases/end-turn";
import { startGame } from "./use-cases/start-game";

export interface GameSnapshot {
  readonly game: GameState;
  /** Evento climático do último turno encerrado, até o jogador dispensá-lo. */
  readonly pendingEvent: EventOutcome | null;
}

export interface GameSessionDeps {
  readonly rules: GameRules;
  readonly repository: GameRepository;
  readonly randomForTurn: (seed: number, turn: number) => RandomSource;
  readonly newSeed: () => number;
}

/**
 * Store observável de uma partida: carrega, aplica use-cases e persiste.
 * Compatível com `useSyncExternalStore`, então a UI não precisa de efeitos para sincronizar estado.
 */
export function createGameSession({ rules, repository, randomForTurn, newSeed }: GameSessionDeps) {
  const listeners = new Set<() => void>();
  let snapshot: GameSnapshot | null = null;

  function load(): GameSnapshot {
    const saved = repository.load();
    const isCompatible = saved?.tiles.every((tile) => tile.kind in rules.tiles) ?? false;
    return { game: saved && isCompatible ? saved : startGame(rules, newSeed()), pendingEvent: null };
  }

  function commit(next: GameSnapshot) {
    snapshot = next;
    repository.save(next.game);
    listeners.forEach((listener) => listener());
  }

  function current(): GameSnapshot {
    snapshot ??= load();
    return snapshot;
  }

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: current,
    applyAction(actionId: string, tileId?: number): ApplyActionResult {
      const result = applyAction(current().game, rules, actionId, tileId);
      if (result.ok) commit({ ...current(), game: result.state });
      return result;
    },
    endTurn() {
      const { game } = current();
      const result = endTurn(game, rules, randomForTurn(game.seed, game.turn));
      commit({ game: result.state, pendingEvent: result.event });
    },
    dismissEvent() {
      commit({ ...current(), pendingEvent: null });
    },
    restart() {
      commit({ game: startGame(rules, newSeed()), pendingEvent: null });
    },
  };
}

export type GameSession = ReturnType<typeof createGameSession>;

import type { GameRepository } from "@/application/ports";
import { GAME_STATE_VERSION, type GameState } from "@/domain/entities/game-state";

const STORAGE_KEY = "ecopolis-2050:game";

/** Salva a partida no navegador. Falhas de acesso (modo privado, cota) nunca quebram o jogo. */
export function createLocalStorageGameRepository(
  getStorage: () => Storage | undefined = browserStorage,
): GameRepository {
  return {
    load() {
      try {
        const raw = getStorage()?.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed: unknown = JSON.parse(raw);
        return isGameState(parsed) ? parsed : null;
      } catch {
        return null;
      }
    },
    save(state) {
      try {
        getStorage()?.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // Sem persistência: a partida continua normalmente nesta aba.
      }
    },
    clear() {
      try {
        getStorage()?.removeItem(STORAGE_KEY);
      } catch {
        // Nada a limpar se o armazenamento não está disponível.
      }
    },
  };
}

function browserStorage(): Storage | undefined {
  try {
    return typeof window === "undefined" ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
}

/** Validação de fronteira: saves de versões antigas ou corrompidos são descartados. */
function isGameState(value: unknown): value is GameState {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<GameState>;
  return (
    candidate.version === GAME_STATE_VERSION &&
    typeof candidate.seed === "number" &&
    typeof candidate.turn === "number" &&
    (candidate.phase === "playing" || candidate.phase === "finished") &&
    typeof candidate.budget === "number" &&
    typeof candidate.happiness === "number" &&
    Array.isArray(candidate.tiles) &&
    Array.isArray(candidate.adoptedPolicies) &&
    Array.isArray(candidate.actionsThisTurn) &&
    Array.isArray(candidate.actionLog) &&
    Array.isArray(candidate.history)
  );
}

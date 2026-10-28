import { createGameSession } from "@/application/game-session";
import { GAME_RULES } from "@/content/rules";
import { createLocalStorageGameRepository } from "@/infrastructure/local-storage-game-repository";
import { createSeededRandom, turnSeed } from "@/infrastructure/seeded-random";

/** Composition root: liga o motor puro às implementações do navegador. */
export const gameSession = createGameSession({
  rules: GAME_RULES,
  repository: createLocalStorageGameRepository(),
  randomForTurn: (seed, turn) => createSeededRandom(turnSeed(seed, turn)),
  newSeed: () => Math.floor(Math.random() * 2 ** 32),
});

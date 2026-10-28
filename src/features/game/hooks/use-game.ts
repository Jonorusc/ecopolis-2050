"use client";

import { useSyncExternalStore } from "react";
import type { GameSnapshot } from "@/application/game-session";
import { gameSession } from "../game-session";

const serverSnapshot = () => null;

/** Estado da partida no client; `null` durante o SSR (o save só existe no navegador). */
export function useGame(): GameSnapshot | null {
  return useSyncExternalStore(gameSession.subscribe, gameSession.getSnapshot, serverSnapshot);
}

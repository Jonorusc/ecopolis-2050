import type { Metadata } from "next";
import { GameScreen } from "@/features/game/components/game-screen";

export const metadata: Metadata = { title: "Jogar" };

export default function PlayPage() {
  return <GameScreen />;
}

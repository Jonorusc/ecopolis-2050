import type { Metadata } from "next";
import { ResultScreen } from "@/features/results/components/result-screen";

export const metadata: Metadata = { title: "Resultado" };

export default function ResultPage() {
  return <ResultScreen />;
}

export type Grade = "A" | "B" | "C" | "D" | "E";

interface GradeThreshold {
  readonly grade: Grade;
  readonly maxWarming: number;
}

/** Faixas inspiradas no Acordo de Paris: A ≈ perto de 1,5 °C, B ≈ abaixo de 2 °C (com folga do modelo). */
const GRADE_THRESHOLDS: readonly GradeThreshold[] = [
  { grade: "A", maxWarming: 1.8 },
  { grade: "B", maxWarming: 2.2 },
  { grade: "C", maxWarming: 2.8 },
  { grade: "D", maxWarming: 3.4 },
];

export function gradeFor(projectedWarming: number): Grade {
  return GRADE_THRESHOLDS.find((threshold) => projectedWarming <= threshold.maxWarming)?.grade ?? "E";
}

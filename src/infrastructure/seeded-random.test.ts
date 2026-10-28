import { describe, expect, it } from "vitest";
import { createSeededRandom, turnSeed } from "./seeded-random";

describe("seeded random", () => {
  it("is deterministic for the same seed", () => {
    const a = createSeededRandom(42);
    const b = createSeededRandom(42);
    expect([a.next(), a.next()]).toEqual([b.next(), b.next()]);
  });

  it("gives consecutive turns independent, roughly uniform first rolls", () => {
    const rolls = Array.from({ length: 2000 }, (_, turn) => createSeededRandom(turnSeed(7, turn)).next());
    const lowerHalf = rolls.filter((roll) => roll < 0.5).length / rolls.length;
    expect(lowerHalf).toBeGreaterThan(0.45);
    expect(lowerHalf).toBeLessThan(0.55);
  });
});

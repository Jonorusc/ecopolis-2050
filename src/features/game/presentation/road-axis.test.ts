import { describe, expect, it } from "vitest";
import { INITIAL_MAP, MAP_COLUMNS } from "@/content/map";
import { roadAxis } from "./road-axis";

const at = (column: number, row: number) => row * MAP_COLUMNS + column;

describe("roadAxis", () => {
  it("runs along the row on the horizontal avenue", () => {
    expect(roadAxis(INITIAL_MAP, at(2, 2), MAP_COLUMNS)).toBe("u");
  });

  it("runs along the column on the vertical avenue", () => {
    expect(roadAxis(INITIAL_MAP, at(4, 4), MAP_COLUMNS)).toBe("v");
  });

  it("marks where both avenues meet as a crossing", () => {
    expect(roadAxis(INITIAL_MAP, at(4, 2), MAP_COLUMNS)).toBe("cross");
  });

  it("does not treat the tile at the end of the previous row as a neighbour", () => {
    expect(roadAxis(INITIAL_MAP, at(0, 3), MAP_COLUMNS)).toBe("u");
  });
});

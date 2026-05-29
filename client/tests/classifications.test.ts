import { describe, it, expect } from "vitest";
import { isApproved, parseReasons, formatReasons } from "../src/lib/classifications";
import { makeCandidate } from "./fixtures";

describe("isApproved", () => {
  it("returns true when reason is an empty string", () => {
    expect(isApproved(makeCandidate({ reason: "" }))).toBe(true);
  });

  it("returns false when reason is a non-empty string", () => {
    expect(isApproved(makeCandidate({ reason: "Edad fuera de rango" }))).toBe(false);
  });

  it("returns false when reason has multiple comma-separated entries", () => {
    expect(
      isApproved(
        makeCandidate({ reason: "Edad fuera de rango, Salario pretendido fuera de rango" })
      )
    ).toBe(false);
  });
});

describe("parseReasons", () => {
  it("returns an empty array for an empty reason string", () => {
    expect(parseReasons("")).toEqual([]);
  });

  it("splits by comma and trims whitespace", () => {
    expect(parseReasons("Edad fuera de rango, Salario pretendido fuera de rango")).toEqual([
      "Edad fuera de rango",
      "Salario pretendido fuera de rango",
    ]);
  });

  it("filters out empty entries from consecutive commas", () => {
    expect(parseReasons("A,,B, ,C")).toEqual(["A", "B", "C"]);
  });

  it("preserves a single reason without commas", () => {
    expect(parseReasons("No es universitario")).toEqual(["No es universitario"]);
  });
});

describe("formatReasons", () => {
  it("joins reasons with comma and space", () => {
    expect(formatReasons(["A", "B", "C"])).toBe("A, B, C");
  });

  it("returns an empty string for an empty array", () => {
    expect(formatReasons([])).toBe("");
  });

  it("trims whitespace from each reason before joining", () => {
    expect(formatReasons([" A ", "B  "])).toBe("A, B");
  });

  it("skips empty entries in the array", () => {
    expect(formatReasons(["A", "", "B"])).toBe("A, B");
  });
});

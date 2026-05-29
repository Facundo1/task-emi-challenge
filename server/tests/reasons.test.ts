import request from "supertest";
import { describe, it, expect, beforeEach } from "vitest";
import { createApp } from "../src/app";
import { candidatesService } from "../src/services/candidatesService";
import { extractUniqueReasons } from "../src/services/reasonsService";
import { makeCandidate } from "./fixtures";

describe("extractUniqueReasons", () => {
  it("returns an empty array when there are no candidates", () => {
    expect(extractUniqueReasons([])).toEqual([]);
  });

  it("ignores approved candidates with an empty reason", () => {
    expect(
      extractUniqueReasons([
        makeCandidate({ reason: "" }),
        makeCandidate({ reason: "" }),
      ])
    ).toEqual([]);
  });

  it("splits comma-separated reasons and deduplicates them", () => {
    const result = extractUniqueReasons([
      makeCandidate({ reason: "Edad fuera de rango, Salario pretendido fuera de rango" }),
      makeCandidate({ reason: "Edad fuera de rango" }),
      makeCandidate({ reason: "No es universitario" }),
    ]);
    expect(result).toEqual([
      "Edad fuera de rango",
      "No es universitario",
      "Salario pretendido fuera de rango",
    ]);
  });

  it("trims whitespace around each reason", () => {
    const result = extractUniqueReasons([
      makeCandidate({ reason: " Edad fuera de rango ,  Otra razón  " }),
    ]);
    expect(result).toEqual(["Edad fuera de rango", "Otra razón"]);
  });

  it("filters out empty entries from extra commas", () => {
    const result = extractUniqueReasons([makeCandidate({ reason: "A,,B, ,C" })]);
    expect(result).toEqual(["A", "B", "C"]);
  });

  it("sorts the result alphabetically using locale-aware comparison", () => {
    const result = extractUniqueReasons([
      makeCandidate({ reason: "Zeta, Alfa, Mu" }),
    ]);
    expect(result).toEqual(["Alfa", "Mu", "Zeta"]);
  });
});

const app = createApp();

describe("GET /api/reasons", () => {
  beforeEach(() => {
    candidatesService.loadInitial([
      makeCandidate({ id: "1", reason: "Edad fuera de rango" }),
      makeCandidate({ id: "2", reason: "Edad fuera de rango, No es universitario" }),
      makeCandidate({ id: "3", reason: "" }),
    ]);
  });

  it("returns unique reasons sorted alphabetically", async () => {
    const res = await request(app).get("/api/reasons");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(["Edad fuera de rango", "No es universitario"]);
  });

  it("returns an empty array when no candidate has a reason", async () => {
    candidatesService.loadInitial([makeCandidate({ reason: "" })]);
    const res = await request(app).get("/api/reasons");
    expect(res.body).toEqual([]);
  });
});

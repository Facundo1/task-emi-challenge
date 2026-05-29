import { describe, it, expect, beforeEach } from "vitest";
import { candidatesService } from "../src/services/candidatesService";
import { approvedCandidate, rejectedCandidate, makeCandidate } from "./fixtures";

beforeEach(() => {
  candidatesService.loadInitial([approvedCandidate, rejectedCandidate]);
});

describe("candidatesService", () => {
  it("returns all candidates after loadInitial", () => {
    expect(candidatesService.findAll()).toHaveLength(2);
  });

  it("finds a candidate by id", () => {
    const result = candidatesService.findById(approvedCandidate.id);
    expect(result?.name).toBe(approvedCandidate.name);
  });

  it("returns null for an unknown id", () => {
    expect(candidatesService.findById("missing")).toBeNull();
  });

  it("updates a candidate and returns the new state", () => {
    const updated = candidatesService.update(rejectedCandidate.id, { reason: "" });
    expect(updated?.reason).toBe("");
  });

  it("returns null when updating a missing candidate", () => {
    expect(candidatesService.update("missing", { reason: "" })).toBeNull();
  });

  it("does not mutate the original fixture after update", () => {
    candidatesService.update(rejectedCandidate.id, { reason: "" });
    expect(rejectedCandidate.reason).not.toBe("");
  });

  it("isolates loadInitial calls so previous state is overwritten", () => {
    candidatesService.loadInitial([makeCandidate({ id: "only-one" })]);
    expect(candidatesService.findAll()).toHaveLength(1);
    expect(candidatesService.findById("only-one")).not.toBeNull();
    expect(candidatesService.findById(approvedCandidate.id)).toBeNull();
  });
});

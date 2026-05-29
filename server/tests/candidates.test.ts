import request from "supertest";
import { describe, it, expect, beforeEach } from "vitest";
import { createApp } from "../src/app";
import { candidatesService } from "../src/services/candidatesService";
import { columnsService } from "../src/services/columnsService";
import {
  approvedCandidate,
  rejectedCandidate,
  candidateWithSingleReason,
} from "./fixtures";

const app = createApp();

beforeEach(() => {
  candidatesService.loadInitial([
    approvedCandidate,
    rejectedCandidate,
    candidateWithSingleReason,
  ]);
  columnsService.loadInitial({ id: true, name: true, reason: true });
});

describe("GET /api/candidates", () => {
  it("returns all candidates loaded into the service", async () => {
    const res = await request(app).get("/api/candidates");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
  });

  it("returns candidates with all expected fields", async () => {
    const res = await request(app).get("/api/candidates");
    expect(res.body[0]).toMatchObject({
      id: approvedCandidate.id,
      name: approvedCandidate.name,
      reason: "",
    });
  });
});

describe("GET /api/candidates/:id", () => {
  it("returns the candidate when the id exists", async () => {
    const res = await request(app).get(`/api/candidates/${approvedCandidate.id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe(approvedCandidate.name);
  });

  it("returns 404 when the id does not exist", async () => {
    const res = await request(app).get("/api/candidates/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });
});

describe("PATCH /api/candidates/:id", () => {
  it("clears the reason when approving a rejected candidate", async () => {
    const res = await request(app)
      .patch(`/api/candidates/${rejectedCandidate.id}`)
      .send({ reason: "" });
    expect(res.status).toBe(200);
    expect(res.body.reason).toBe("");
    expect(res.body.id).toBe(rejectedCandidate.id);
  });

  it("updates the reason when rejecting a candidate with multiple reasons", async () => {
    const reasons = "Edad fuera de rango, Salario pretendido fuera de rango";
    const res = await request(app)
      .patch(`/api/candidates/${approvedCandidate.id}`)
      .send({ reason: reasons });
    expect(res.status).toBe(200);
    expect(res.body.reason).toBe(reasons);
  });

  it("persists the mutation across subsequent GET requests", async () => {
    await request(app)
      .patch(`/api/candidates/${rejectedCandidate.id}`)
      .send({ reason: "" });
    const res = await request(app).get(`/api/candidates/${rejectedCandidate.id}`);
    expect(res.body.reason).toBe("");
  });

  it("returns 400 when reason is not a string", async () => {
    const res = await request(app)
      .patch(`/api/candidates/${approvedCandidate.id}`)
      .send({ reason: 123 });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/string/i);
  });

  it("returns 400 when reason is missing", async () => {
    const res = await request(app)
      .patch(`/api/candidates/${approvedCandidate.id}`)
      .send({});
    expect(res.status).toBe(400);
  });

  it("returns 404 when the candidate id does not exist", async () => {
    const res = await request(app)
      .patch("/api/candidates/does-not-exist")
      .send({ reason: "" });
    expect(res.status).toBe(404);
  });
});

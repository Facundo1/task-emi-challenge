import request from "supertest";
import { describe, it, expect, beforeEach } from "vitest";
import { createApp } from "../src/app";
import { columnsService } from "../src/services/columnsService";

const app = createApp();

beforeEach(() => {
  columnsService.loadInitial({
    id: true,
    name: true,
    email: true,
    cv_bumeran: false,
    has_university: false,
    reason: true,
  });
});

describe("GET /api/columns", () => {
  it("returns the columns config exactly as loaded", async () => {
    const res = await request(app).get("/api/columns");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: true,
      name: true,
      email: true,
      cv_bumeran: false,
      has_university: false,
      reason: true,
    });
  });
});

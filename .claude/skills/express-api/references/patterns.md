# Express API Patterns — emi-challenge

> Cargado on-demand desde `SKILL.md` cuando la pregunta es sobre código de ejemplo de route, service, middleware.

## Route handler (thin)

```ts
import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { NotFoundError, ValidationError } from "../errors";
import { candidatesService } from "../services/candidatesService";

export const candidatesRouter = Router();

candidatesRouter.get("/", asyncHandler(async (_req, res) => {
  res.json(candidatesService.findAll());
}));

candidatesRouter.get("/:id", asyncHandler(async (req, res) => {
  const candidate = candidatesService.findById(req.params.id);
  if (!candidate) throw new NotFoundError(`Candidate ${req.params.id} not found`);
  res.json(candidate);
}));

candidatesRouter.patch("/:id", asyncHandler(async (req, res) => {
  const reason = req.body?.reason;
  if (typeof reason !== "string") throw new ValidationError("reason must be a string");
  const updated = candidatesService.update(req.params.id, { reason });
  if (!updated) throw new NotFoundError(`Candidate ${req.params.id} not found`);
  res.json(updated);
}));
```

## Service (thick)

```ts
import type { Candidate } from "../types/api";

let store: Candidate[] = [];

export const candidatesService = {
  loadInitial(candidates: Candidate[]) { store = [...candidates]; },
  findAll(): Candidate[] { return store; },
  findById(id: string): Candidate | null {
    return store.find((c) => c.id === id) ?? null;
  },
  update(id: string, patch: Partial<Candidate>): Candidate | null {
    const idx = store.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    store[idx] = { ...store[idx], ...patch };
    return store[idx];
  },
};
```

## Errors tipados

```ts
export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string) { super(404, message); }
}

export class ValidationError extends HttpError {
  constructor(message: string) { super(400, message); }
}
```

## Error middleware

```ts
import type { ErrorRequestHandler } from "express";
import { HttpError } from "../errors";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};
```

Montar **último** en la chain del app:

```ts
app.use("/api/candidates", candidatesRouter);
// ... otros routers
app.use(errorHandler);
```

## asyncHandler helper

```ts
import type { RequestHandler } from "express";

export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
```

Sin esto, errors en async handlers no llegan al middleware → uncaught + crash.

## Bootstrap (`index.ts`)

```ts
import express from "express";
import { candidatesRouter } from "./routes/candidates";
import { columnsRouter } from "./routes/columns";
import { reasonsRouter } from "./routes/reasons";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";
import { loadData } from "./services/dataLoader";
import { candidatesService } from "./services/candidatesService";
import { columnsService } from "./services/columnsService";

const PORT = Number(process.env.PORT ?? 3001);

async function main() {
  const { candidates, columns } = await loadData();
  candidatesService.loadInitial(candidates);
  columnsService.loadInitial(columns);

  const app = express();
  app.use(express.json());
  app.use(requestLogger);

  app.use("/api/candidates", candidatesRouter);
  app.use("/api/columns", columnsRouter);
  app.use("/api/reasons", reasonsRouter);

  app.use(errorHandler);

  app.listen(PORT, () => console.log(`Server on :${PORT}`));
}

main().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
```

## Tests con supertest

```ts
import request from "supertest";
import { describe, it, expect, beforeEach } from "vitest";
import { app } from "./testApp";

describe("GET /api/candidates", () => {
  beforeEach(() => candidatesService.loadInitial(fixtures.candidates));

  it("returns all candidates from the data file", async () => {
    const res = await request(app).get("/api/candidates");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(fixtures.candidates.length);
  });
});

describe("PATCH /api/candidates/:id", () => {
  it("returns 404 when candidate id does not exist", async () => {
    const res = await request(app).patch("/api/candidates/nonexistent").send({ reason: "" });
    expect(res.status).toBe(404);
  });

  it("returns 400 when reason is not a string", async () => {
    const id = fixtures.candidates[0].id;
    const res = await request(app).patch(`/api/candidates/${id}`).send({ reason: 123 });
    expect(res.status).toBe(400);
  });

  it("clears reason when approving", async () => {
    const rejected = fixtures.candidates.find((c) => c.reason);
    const res = await request(app).patch(`/api/candidates/${rejected.id}`).send({ reason: "" });
    expect(res.status).toBe(200);
    expect(res.body.reason).toBe("");
  });
});
```

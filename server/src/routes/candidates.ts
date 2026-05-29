import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { NotFoundError, ValidationError } from "../errors";
import { candidatesService } from "../services/candidatesService";

export const candidatesRouter = Router();

candidatesRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(candidatesService.findAll());
  })
);

candidatesRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const candidate = candidatesService.findById(req.params.id);
    if (!candidate) {
      throw new NotFoundError(`Candidate ${req.params.id} not found`);
    }
    res.json(candidate);
  })
);

const ALLOWED_PATCH_KEYS: ReadonlySet<string> = new Set(["reason"]);

candidatesRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const body: unknown = req.body;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new ValidationError("body must be a JSON object");
    }
    const payload = body as Record<string, unknown>;
    const unknownKey = Object.keys(payload).find((k) => !ALLOWED_PATCH_KEYS.has(k));
    if (unknownKey) {
      throw new ValidationError(`unknown field: ${unknownKey}`);
    }
    if (typeof payload.reason !== "string") {
      throw new ValidationError("reason must be a string");
    }
    const updated = candidatesService.update(req.params.id, { reason: payload.reason });
    if (!updated) {
      throw new NotFoundError(`Candidate ${req.params.id} not found`);
    }
    res.json(updated);
  })
);

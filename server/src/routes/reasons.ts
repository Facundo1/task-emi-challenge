import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { reasonsService } from "../services/reasonsService";

export const reasonsRouter = Router();

reasonsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(reasonsService.findAll());
  })
);

import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { columnsService } from "../services/columnsService";

export const columnsRouter = Router();

columnsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(columnsService.findAll());
  })
);

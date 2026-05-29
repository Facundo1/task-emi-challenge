import type { ErrorRequestHandler } from "express";
import { HttpError } from "../errors";

const isDev = process.env.NODE_ENV !== "production";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  console.error("Unexpected error:", err);
  const payload: { error: string; stack?: string } = { error: "Internal server error" };
  if (isDev && err instanceof Error) {
    payload.stack = err.stack;
  }
  res.status(500).json(payload);
};

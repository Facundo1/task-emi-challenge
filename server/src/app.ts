import express, { type Express } from "express";
import { candidatesRouter } from "./routes/candidates";
import { columnsRouter } from "./routes/columns";
import { reasonsRouter } from "./routes/reasons";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";

export function createApp(): Express {
  const app = express();
  app.use(express.json());
  app.use(requestLogger);

  app.use("/api/candidates", candidatesRouter);
  app.use("/api/columns", columnsRouter);
  app.use("/api/reasons", reasonsRouter);

  app.use(errorHandler);
  return app;
}

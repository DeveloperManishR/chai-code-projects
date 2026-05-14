import express from "express";
import type { Application } from "express";
import cors from "cors";
import { env } from "../env.js";
import authRoute from "./modules/auth/auth.route.js";
import pollRoute from "./modules/polling/polling.route.js";
import { errorHandler } from "./common/middleware/error.middleware.js";
import { httpLogger } from "./common/middleware/http.logger.middleware.js";

export function createServerApplication(): Application {
  const app = express();

  // ─── Core Middleware ────────────────────────────────────────────────────
  app.use(express.json());
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    })
  );
  app.use(httpLogger);

  // ─── Health Check ──────────────────────────────────────────────────────
  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // ─── API Routes ────────────────────────────────────────────────────────
  app.use("/api/auth", authRoute);
  app.use("/api/polls", pollRoute);

  // ─── Global Error Handler (must be last) ───────────────────────────────
  app.use(errorHandler);

  return app;
}

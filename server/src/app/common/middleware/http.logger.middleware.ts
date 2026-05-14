import logger from "../utils/logger.js";
import type { NextFunction, Request, Response } from "express";

export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
  if (req.originalUrl.startsWith("/public/")) {
    return next();
  }

  const start = Date.now();
  
  const ip = req.ip// req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.ip;

  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const level = status >= 500 ? "error" : status >= 400 ? "warn" : "http";

    logger[level](`${req.method} ${req.originalUrl}`, {
      status,
      duration_ms: duration,
      ip,
    });
  });

  next();
};

import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/api-error.js";

/**
 * Global Express error-handling middleware.
 * Must be registered LAST after all routes.
 * Catches ApiError instances and unknown errors, returning consistent JSON.
 */
const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Log unexpected errors in development
  if (process.env.NODE_ENV !== "production") {
    console.error("Unhandled error:", err);
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export { errorHandler };

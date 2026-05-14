import type { Request, Response, NextFunction } from "express";



/**
 * Wraps an async route handler to automatically catch errors
 * and forward them to Express error-handling middleware.
 */
const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export {  asyncHandler };
import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import { ZodError } from "zod";

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({ body: req.body });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formatted = error.issues.map((issue) => ({
          path: issue.path.join(".").replace(/^body\./, ""),
          message: issue.message,
        }));

        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errors: formatted,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

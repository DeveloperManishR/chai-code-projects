import type { NextFunction, Request, Response } from "express";
import ApiError from "../../common/utils/api-error.js";
import { verifyAccessToken } from "../../common/utils/jwt.utils.js";
import User from "../../modules/auth/auth.model.js";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(ApiError.unauthorized("Not authenticated"));
    }

    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded._id);

    if (!user) {
      return next(ApiError.unauthorized("User no longer exists"));
    }

    req.user = {
      _id: user._id.toString(),
      role: user.role,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    next(ApiError.unauthorized("Invalid or expired token"));
  }
};

export { authenticate };
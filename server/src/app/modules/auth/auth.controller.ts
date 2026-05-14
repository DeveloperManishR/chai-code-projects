import type { Request, Response } from "express";
import { sendVerificationEmail } from "../../common/config/email.js";
import User from "./auth.model.js";
import ApiError from "../../common/utils/api-error.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
} from "../../common/utils/jwt.utils.js";
import ApiResponse from "../../common/utils/api-response.js";
import crypto from "node:crypto";
import { asyncHandler } from "../../common/utils/helper.js";

const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

/**
 * Sanitize user document for API responses.
 * Strips sensitive fields so they are never leaked.
 */
const sanitizeUser = (user: Record<string, unknown>) => {
  const {
    password,
    refreshToken,
    verificationToken,
    resetPasswordToken,
    resetPasswordExpires,
    __v,
    ...safe
  } = user;
  return safe;
};

// ─── Register ───────────────────────────────────────────────────────────────
const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw ApiError.conflict("Email already exists");

  const { rawToken, hashedToken } = generateResetToken();

  const user = await User.create({
    name,
    email,
    password,
    verificationToken: hashedToken,
  });

  await sendVerificationEmail(email, rawToken);

  ApiResponse.created(res, "Registration successful", sanitizeUser(user.toObject()));
});

// ─── Login ──────────────────────────────────────────────────────────────────
const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await (user as any).comparePassword(password))) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  if (!user.isVerified) {
    throw ApiError.forbidden("Please verify your email before logging in");
  }

  const accessToken = generateAccessToken({ _id: user._id.toString(), role: user.role });
  const refreshToken = generateRefreshToken({ _id: user._id.toString() });

  user.refreshToken = hashToken(refreshToken);
  await user.save({ validateBeforeSave: false });

  ApiResponse.ok(res, "Login successful", {
    user: sanitizeUser(user.toObject()),
    accessToken,
    refreshToken,
  });
});


const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  
  const trimmed = String(req.params.token).trim();
  console.log("trimmedtrimmedtrimmed",trimmed)
  // if (!trimmed) {
  //   throw ApiError.badRequest("Invalid or expired verification token");
  // }

  const hashedInput = hashToken(trimmed);
  let user = await User.findOne({ verificationToken: hashedInput }).select(
    "+verificationToken",
  );
  if (!user) {
    user = await User.findOne({ verificationToken: trimmed }).select(
      "+verificationToken",
    );
  }
  if (!user) throw ApiError.badRequest("Invalid or expired verification token");

  await User.findByIdAndUpdate(user._id, {
    $set: { isVerified: true },
    $unset: { verificationToken: 1 },
  });

  ApiResponse.ok(res, "Email verified successfully. You can now log in.");
});

export { register, login , verifyEmail };
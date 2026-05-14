import { z } from "zod";
import "dotenv/config";
const envSchema = z.object({
  PORT: z.string().default("8000"),

  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  JWT_ACCESS_SECRET: z
    .string()
    .min(10, "JWT_ACCESS_SECRET must be at least 10 characters"),

  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),

  JWT_REFRESH_SECRET: z
    .string()
    .min(10, "JWT_REFRESH_SECRET must be at least 10 characters"),

  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  CLIENT_URL: z.string().url().default("http://localhost:3000"),

  // SMTP
  SMTP_FROM_EMAIL: z.string().email("SMTP_FROM_EMAIL must be a valid email"),

  SMTP_USER: z.string().min(1, "SMTP_USER is required"),

  SMTP_PASSWORD: z.string().min(1, "SMTP_PASS is required"),

  SMTP_HOST: z.string().min(1, "SMTP_HOST is required"),
  SMTP_PORT: z.string().min(1, "SMTP_PORT is required"),
});

function createEnv(env: NodeJS.ProcessEnv) {
  const safeParseResult = envSchema.safeParse(env);

  if (!safeParseResult.success) {
    console.error(
      "❌ Invalid environment variables:",
      safeParseResult.error.flatten().fieldErrors,
    );

    throw new Error("Invalid environment variables");
  }

  return safeParseResult.data;
}

export const env = createEnv(process.env);

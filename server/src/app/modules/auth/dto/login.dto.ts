import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string("Email is required")
      .email("Invalid email format")
      .trim()
      .toLowerCase(),

    password: z
      .string("Password is Required")
      .min(8, "Password must be at least 8 characters"),
  }),
});

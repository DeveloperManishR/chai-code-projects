import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string("Name is required")
      .min(3, "Name must be at least 2 characters")
      .max(50, "Name must not exceed 50 characters")
      .trim(),

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

export type UserInterface = z.infer<typeof registerSchema>;

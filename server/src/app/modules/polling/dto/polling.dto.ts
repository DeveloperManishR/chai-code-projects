import { z } from "zod";

const optionSchema = z.object({
  text: z.string().trim().min(1, "Option text is required"),
});

const questionSchema = z.object({
  question: z.string().trim().min(1, "Question is required"),

  options: z
    .array(optionSchema)
    .min(2, "A question must have at least 2 options"),
});

export const createPollSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(5, "Title must be at least 5 characters")
      .max(100, "Title cannot exceed 100 characters"),

    description: z
      .string()
      .min(5, "Description must be at least 5 characters")
      .max(500, "Description cannot exceed 500 characters"),

    questions: z
      .array(questionSchema)
      .min(1, "At least one question is required"),

    expiryTime: z.string().datetime("expiryTime must be a valid ISO 8601 date"),
  }),
});

export type CreatePollInput = z.infer<typeof createPollSchema>["body"];

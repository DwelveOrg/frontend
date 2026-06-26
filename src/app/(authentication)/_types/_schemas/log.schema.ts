import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().trim().min(3, "Must be at least 3 characters."),
  password: z
    .string()
    .min(5, "Password must be at least 5 characters.")
    .max(72, "Password must be at most 72 characters."),
});

export type LoginFormField = z.infer<typeof loginSchema>;

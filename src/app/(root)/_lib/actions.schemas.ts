import { z } from "zod";

/**
 * Input schemas for the dashboard server actions. Kept in a plain module (not a
 * `"use server"` file, which may only export async functions) so both the
 * actions and the client forms/react-hook-form resolvers can import them.
 */

/** Mirrors the backend `CreateClassDto` limits. */
export const createClassSchema = z.object({
  name: z.string().trim().min(1).max(120),
  gradeLevel: z.string().trim().max(80).optional(),
  description: z.string().trim().max(500).optional(),
});

export type CreateClassInput = z.infer<typeof createClassSchema>;

export const inviteTeacherSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
});

export type InviteTeacherInput = z.infer<typeof inviteTeacherSchema>;

export const updateSchoolSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional(),
  country: z.string().trim().max(80).optional(),
  city: z.string().trim().max(80).optional(),
  logoUrl: z
    .string()
    .trim()
    .max(500)
    .refine((value) => !value || URL.canParse(value), "Enter a valid URL")
    .optional(),
});

export type UpdateSchoolInput = z.infer<typeof updateSchoolSchema>;

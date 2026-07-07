import { z } from "zod";

/**
 * Form-input schemas for the profile server actions. Kept in a plain module
 * (not `"use server"`) so both actions and client forms/react-hook-form
 * resolvers can import them.
 */

export const updateFullNameSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
});
export type UpdateFullNameInput = z.infer<typeof updateFullNameSchema>;

/** Empty string means "clear the field". */
export const updateSchoolProfileSchema = z.object({
  phone: z.string().trim().max(40).optional(),
  bio: z.string().trim().max(500).optional(),
});
export type UpdateSchoolProfileInput = z.infer<typeof updateSchoolProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8).max(128),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const revokeSessionSchema = z.object({
  sessionId: z.string().min(1),
});
export type RevokeSessionInput = z.infer<typeof revokeSessionSchema>;

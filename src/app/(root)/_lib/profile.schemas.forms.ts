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
    newPassword: z.string().min(8).max(72),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

/**
 * First-time password setup for accounts without a password yet (e.g. Google-only
 * users, `authMethods.password === false`). No `currentPassword` — the backend
 * accepts just `newPassword` for these accounts.
 */
export const setPasswordSchema = z
  .object({
    newPassword: z.string().min(8).max(72),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });
export type SetPasswordInput = z.infer<typeof setPasswordSchema>;

export const revokeSessionSchema = z.object({
  sessionId: z.string().min(1),
});
export type RevokeSessionInput = z.infer<typeof revokeSessionSchema>;

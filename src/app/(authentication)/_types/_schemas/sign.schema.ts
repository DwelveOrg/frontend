import { z } from "zod";

/**
 * Regular account signup is role-free. Workspace roles are granted later by
 * creating a workspace, redeeming an invite, or joining through a student code.
 */
export const regularSignupSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(5, "Full name must be at least 5 characters.")
    .max(120, "Full name must be at most 120 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password must be at most 72 characters."),
});

export type RegularSignupFormField = z.infer<typeof regularSignupSchema>;

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Workspace name must be at least 2 characters.")
    .max(120, "Workspace name must be at most 120 characters."),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "Slug must be at least 2 characters.")
    .max(80, "Slug must be at most 80 characters.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
  phone: z.string().trim().max(40, "Phone must be at most 40 characters.").optional(),
  address: z.string().trim().max(255, "Address must be at most 255 characters.").optional(),
});

export type CreateWorkspaceFormField = z.infer<typeof createWorkspaceSchema>;

export const centerTypes = [
  "tutoring",
  "privateSchool",
  "language",
  "examPrep",
  "university",
  "other",
] as const;

export const centerSizes = ["sm", "md", "lg", "xl"] as const;

export type CenterType = (typeof centerTypes)[number];
export type CenterSize = (typeof centerSizes)[number];

/**
 * Admin / center registration is a heavier, multi-step flow kept separate from
 * account signup. Creating an organization grants the role through membership.
 */
export const adminSignupSchema = z
  .object({
    fullName: z.string().trim().min(5, "Full name must be at least 5 characters."),
    email: z.string().email("Please enter a valid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(32, "Password must be at most 32 characters."),
    confirmPassword: z.string(),
    centerName: z.string().trim().min(2, "Center name must be at least 2 characters."),
    centerType: z.enum(centerTypes, { error: "Please select a center type." }),
    centerSize: z.enum(centerSizes, { error: "Please select an approximate size." }),
    termsAccepted: z.boolean().refine((value) => value === true, {
      message: "You must accept the terms to continue.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type AdminSignupFormField = z.infer<typeof adminSignupSchema>;

export const googleAuthSchema = z.object({
  idToken: z.string().min(1, "Google ID token is required."),
});

export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;

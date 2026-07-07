import { z } from "zod";

/**
 * Regular account signup is role-free. School roles are granted later by
 * creating a school, redeeming an invite, or joining through a student code.
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

const SCHOOL_LOGO_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;
const SCHOOL_LOGO_MAX_BYTES = 5 * 1024 * 1024;

const schoolLogoFileSchema = z
  .instanceof(File, { message: "Please choose an image file." })
  .refine((file) => file.size > 0, "Please choose an image file.")
  .refine(
    (file) => (SCHOOL_LOGO_MIME_TYPES as readonly string[]).includes(file.type),
    "Only PNG, JPEG, or WebP images are allowed.",
  )
  .refine(
    (file) => file.size <= SCHOOL_LOGO_MAX_BYTES,
    "Image must be under 5 MB.",
  );

export const createSchoolSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "School name is required.")
    .max(120, "School name must be at most 120 characters."),
  description: z.string().trim().max(500, "Description must be at most 500 characters.").optional(),
  country: z.string().trim().max(80, "Country must be at most 80 characters.").optional(),
  city: z.string().trim().max(80, "City must be at most 80 characters.").optional(),
  logo: schoolLogoFileSchema.optional(),
});

export type CreateSchoolFormField = z.infer<typeof createSchoolSchema>;

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

export const joinSchoolSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Join code is required.")
    .max(64, "Join code must be at most 64 characters."),
});

export type JoinSchoolFormField = z.infer<typeof joinSchoolSchema>;

export const googleAuthSchema = z.object({
  idToken: z.string().min(1, "Google ID token is required."),
});

export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;

/** Teacher invite acceptance: the raw token comes from the invite link's path. */
export const acceptTeacherInviteSchema = z.object({
  token: z.string().trim().min(1, "This invite link is missing its token."),
});

export type AcceptTeacherInviteInput = z.infer<typeof acceptTeacherInviteSchema>;

/** Forgot-password screen: only an email is collected. */
export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export type ForgotPasswordFormField = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset-password form fields. The token comes from the reset link's query
 * string, not from the form, so it lives on {@link resetPasswordSchema} instead.
 */
export const resetPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(72, "Password must be at most 72 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormField = z.infer<typeof resetPasswordFormSchema>;

/**
 * Server-action input for resetting a password. Presence of the token is checked
 * here; its length/validity is left to the backend so an invalid link surfaces
 * as the intended "expired or invalid" message rather than a form error.
 */
export const resetPasswordSchema = z.object({
  token: z.string().trim().min(1, "This reset link is missing its token."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password must be at most 72 characters."),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

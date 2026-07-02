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

export const createSchoolSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "School name is required.")
    .max(120, "School name must be at most 120 characters."),
  description: z.string().trim().max(500, "Description must be at most 500 characters.").optional(),
  country: z.string().trim().max(80, "Country must be at most 80 characters.").optional(),
  city: z.string().trim().max(80, "City must be at most 80 characters.").optional(),
  logoUrl: z
    .string()
    .trim()
    .max(500, "Logo URL must be at most 500 characters.")
    .url("Enter a full URL including https://")
    // Only allow web URLs — blocks javascript:/data: and other schemes from
    // ever being stored and later rendered as an image source.
    .refine(
      (value) => /^https?:\/\//i.test(value),
      "Logo URL must start with http:// or https://",
    )
    .optional()
    .or(z.literal("")),
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
    .max(20, "Join code must be at most 20 characters."),
});

export type JoinSchoolFormField = z.infer<typeof joinSchoolSchema>;

export const googleAuthSchema = z.object({
  idToken: z.string().min(1, "Google ID token is required."),
});

export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;

import { z } from "zod";

/**
 * Regular learner signup — kept deliberately short (name, email, password)
 * so it converts fast. Terms are accepted inline, and "Continue with Google"
 * offers a one-click path. Self-service signups are always learners; teacher
 * and admin access never come from this screen.
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
 * Admin / center registration — a heavier, multi-step flow reached from a
 * separate link, not shown side-by-side with the learner signup. Grouped into
 * account details, center details, and a review step.
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

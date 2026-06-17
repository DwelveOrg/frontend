"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession } from "./session";
import {
  adminSignupSchema,
  loginSchema,
  regularSignupSchema,
} from "@/app/(authentication)/_types/_schemas";
import { findDemoUserByIdentifier, isPrototypeAuthEnabled } from "./demo-users";

export type LoginActionState = {
  error: string | null;
  success: boolean;
  redirectTo?: string;
};

export type SignupActionState = {
  error: string | null;
  success: boolean;
  redirectTo?: string;
};

const AUTH_NOT_CONFIGURED_ERROR =
  "Authentication is not configured for this environment yet.";

export async function login(
  prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  if (!isPrototypeAuthEnabled()) {
    return { error: AUTH_NOT_CONFIGURED_ERROR, success: false };
  }

  const parsed = loginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Invalid username/email or password.", success: false };
  }

  const { identifier, password } = parsed.data;

  const matchedUser = findDemoUserByIdentifier(identifier);
  if (!matchedUser) {
    return { error: "Invalid username/email or password.", success: false };
  }

  if(matchedUser.password !== password){
    return { error: "Invalid username/email or password.", success: false };
  }

  await createSession(matchedUser.id, {
    name: matchedUser.name,
    role: matchedUser.role,
    identifier: matchedUser.identifier,
  });
  return { error: null, success: true, redirectTo: "/dashboard" };
}

// Regular learner signup — the fast, default path. Role is always "student";
// teacher/admin access never originates here.
export async function signup(
  prevState: SignupActionState,
  formData: FormData,
): Promise<SignupActionState> {
  if (!isPrototypeAuthEnabled()) {
    return { error: AUTH_NOT_CONFIGURED_ERROR, success: false };
  }

  const parsed = regularSignupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Please check the form and try again.", success: false };
  }

  const { fullName, email } = parsed.data;

  // No backend yet: key the prototype session on the email so the new account
  // can land in the dashboard without exposing credentials to client bundles.
  await createSession(`account:${email.toLowerCase()}`, {
    name: fullName,
    role: "student",
    identifier: email,
  });

  return { error: null, success: true, redirectTo: "/dashboard" };
}

// One-click learner signup. Placeholder for real Google OAuth: there is no
// backend yet, so this just opens a demo learner session to keep the fast
// path working end-to-end. Wire to a real OAuth provider when available.
export async function googleSignup(): Promise<SignupActionState> {
  if (!isPrototypeAuthEnabled()) {
    return { error: AUTH_NOT_CONFIGURED_ERROR, success: false };
  }

  await createSession("account:google-demo", {
    name: "",
    role: "student",
    identifier: "google-demo",
  });

  return { error: null, success: true, redirectTo: "/dashboard" };
}

// Admin / center registration — the heavier, multi-step flow. Creating a
// center grants the "admin" role.
export async function adminSignup(
  prevState: SignupActionState,
  formData: FormData,
): Promise<SignupActionState> {
  if (!isPrototypeAuthEnabled()) {
    return { error: AUTH_NOT_CONFIGURED_ERROR, success: false };
  }

  const parsed = adminSignupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    centerName: formData.get("centerName"),
    centerType: formData.get("centerType"),
    centerSize: formData.get("centerSize"),
    termsAccepted: formData.get("termsAccepted") === "true",
  });

  if (!parsed.success) {
    return { error: "Please check the form and try again.", success: false };
  }

  const { fullName, email } = parsed.data;

  await createSession(`center:${email.toLowerCase()}`, {
    name: fullName,
    role: "admin",
    identifier: email,
  });

  return { error: null, success: true, redirectTo: "/dashboard" };
}

export async function logout() {
  await deleteSession();
  redirect("/login?logout=1");
}

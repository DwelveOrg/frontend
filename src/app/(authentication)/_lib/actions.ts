"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession } from "./session";
import {
  adminSignupSchema,
  loginSchema,
  regularSignupSchema,
} from "@/app/(authentication)/_types/_schemas";
import { testUsers } from '@/app/(authentication)/_constants/index'

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

export async function login(
  prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const parsed = loginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Invalid username/email or password.", success: false };
  }

  const { identifier, password } = parsed.data;

  const matchedUser = testUsers.find(user => user.identifier === identifier);
  if (!matchedUser) {
    return { error: "Invalid username/email or password.", success: false };
  }

  if(matchedUser.password !== password){
    return { error: "Invalid username/email or password.", success: false };
  }

  await createSession(matchedUser.id);
  return { error: null, success: true, redirectTo: "/dashboard" };
}

// Regular learner signup — the fast, default path. Role is always "student";
// teacher/admin access never originates here.
export async function signup(
  prevState: SignupActionState,
  formData: FormData,
): Promise<SignupActionState> {
  const parsed = regularSignupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Please check the form and try again.", success: false };
  }

  const { fullName, email } = parsed.data;

  // No backend yet: key the demo session on the email so the new account can
  // land in the dashboard. Existing `testUsers` keep logging in unchanged.
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

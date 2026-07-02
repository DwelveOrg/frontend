"use server";

import { redirect } from "next/navigation";
import { actionClient, ActionError } from "@/lib/safe-action";
import {
  createSchoolSchema,
  googleAuthSchema,
  joinSchoolSchema,
  loginSchema,
  regularSignupSchema,
  type CreateSchoolFormField,
  type JoinSchoolFormField,
  type LoginFormField,
  type RegularSignupFormField,
} from "@/app/(authentication)/_types/_schemas";
import {
  backendJson,
  BackendApiError,
  type AuthResponse,
  type CreateSchoolResponse,
  type JoinSchoolResponse,
} from "./api";
import { authedBackendJson } from "./backend";
import { createSession, deleteSession, getSession } from "./session";

const INVALID_LOGIN_ERROR = "Invalid email or password.";
const INVALID_SIGNUP_ERROR = "Please check the form and try again.";
const INVALID_SCHOOL_ERROR = "Please check the school details and try again.";
const INVALID_JOIN_ERROR = "Invalid join code. Please check and try again.";
const NETWORK_ERROR = "Unable to reach Dwelve API. Please try again.";

export type AuthMutationResult = {
  redirectTo: string;
};

/**
 * Maps an unknown thrown error to a safe, user-facing message. Only
 * {@link BackendApiError} messages (which the backend intends to be shown) and a
 * couple of known network cases are surfaced; anything else is logged and
 * collapsed to `fallback` so internal error details never reach the client.
 */
function getActionError(error: unknown, fallback: string) {
  if (error instanceof BackendApiError) {
    return error.message;
  }

  if (error instanceof TypeError) {
    return NETWORK_ERROR;
  }

  console.error("Auth action error:", error);
  return fallback;
}

async function createSessionFromAuthResponse(response: AuthResponse) {
  await createSession({
    userId: response.user.id,
    email: response.user.email,
    fullName: response.user.fullName,
    accessToken: response.tokens.accessToken,
    refreshToken: response.tokens.refreshToken,
    schoolId: response.member?.schoolId ?? response.school?.id,
    memberId: response.member?.id,
    schoolRole: response.member?.role,
    membershipCount: response.memberships?.length ?? (response.member ? 1 : 0),
  });
}

async function createSessionFromSchoolResponse(response: CreateSchoolResponse) {
  const session = await getSession();
  const membership = response.membership ?? response.member;

  if (!session?.userId || !session.email || !session.fullName || !membership) {
    throw new BackendApiError("Your session expired. Please log in again.");
  }

  await createSession({
    userId: session.userId,
    email: session.email,
    fullName: session.fullName,
    accessToken: response.tokens.accessToken,
    refreshToken: response.tokens.refreshToken,
    schoolId: membership.schoolId,
    memberId: membership.id,
    schoolRole: membership.role,
    membershipCount: Math.max(session.membershipCount ?? 0, 1),
  });
}

async function loginWithInput(input: LoginFormField): Promise<AuthMutationResult> {
  try {
    const response = await backendJson<AuthResponse>("/auth/login", {
      method: "POST",
      body: input,
    });

    await createSessionFromAuthResponse(response);

    return { redirectTo: "/dashboard" };
  } catch (error) {
    throw new ActionError(getActionError(error, INVALID_LOGIN_ERROR));
  }
}

async function signupWithInput(input: RegularSignupFormField): Promise<AuthMutationResult> {
  try {
    const response = await backendJson<AuthResponse>("/auth/signup", {
      method: "POST",
      body: input,
    });

    await createSessionFromAuthResponse(response);

    return { redirectTo: "/dashboard" };
  } catch (error) {
    throw new ActionError(getActionError(error, INVALID_SIGNUP_ERROR));
  }
}

async function createSchoolWithInput(input: CreateSchoolFormField) {
  try {
    // Drop empty optional fields so the backend receives only meaningful values.
    const body: Record<string, string> = { name: input.name };
    for (const key of ["description", "country", "city", "logoUrl"] as const) {
      const value = input[key]?.trim();
      if (value) {
        body[key] = value;
      }
    }

    const response = await authedBackendJson<CreateSchoolResponse>("/schools", {
      method: "POST",
      body,
    });

    await createSessionFromSchoolResponse(response);

    return { schoolId: response.school.id };
  } catch (error) {
    throw new ActionError(getActionError(error, INVALID_SCHOOL_ERROR));
  }
}

async function joinSchoolWithInput(input: JoinSchoolFormField) {
  try {
    const response = await authedBackendJson<JoinSchoolResponse>("/schools/join", {
      method: "POST",
      body: { code: input.code.trim() },
    });

    const session = await getSession();

    if (!session?.userId || !session.email || !session.fullName) {
      throw new BackendApiError("Your session expired. Please log in again.");
    }

    await createSession({
      userId: session.userId,
      email: session.email,
      fullName: session.fullName,
      accessToken: response.tokens.accessToken,
      refreshToken: response.tokens.refreshToken,
      schoolId: response.membership.schoolId,
      memberId: response.membership.id,
      schoolRole: response.membership.role,
      membershipCount: Math.max(session.membershipCount ?? 0, 1),
    });

    return { schoolId: response.school.id };
  } catch (error) {
    throw new ActionError(getActionError(error, INVALID_JOIN_ERROR));
  }
}

async function googleAuthWithToken(idToken: string): Promise<AuthMutationResult> {
  try {
    const response = await backendJson<AuthResponse>("/auth/google", {
      method: "POST",
      body: { idToken },
    });

    await createSessionFromAuthResponse(response);
    return { redirectTo: "/dashboard" };
  } catch (error) {
    throw new ActionError(getActionError(error, "Google sign-in failed. Please try again."));
  }
}

export const googleAuthAction = actionClient
  .inputSchema(googleAuthSchema)
  .action(async ({ parsedInput }) => googleAuthWithToken(parsedInput.idToken));

export const loginAction = actionClient
  .inputSchema(loginSchema)
  .action(async ({ parsedInput }) => loginWithInput(parsedInput));

export const signupAction = actionClient
  .inputSchema(regularSignupSchema)
  .action(async ({ parsedInput }) => signupWithInput(parsedInput));

export const createSchoolAction = actionClient
  .inputSchema(createSchoolSchema)
  .action(async ({ parsedInput }) => createSchoolWithInput(parsedInput));

export const joinSchoolAction = actionClient
  .inputSchema(joinSchoolSchema)
  .action(async ({ parsedInput }) => joinSchoolWithInput(parsedInput));

export async function logout() {
  const session = await getSession();

  if (session?.refreshToken) {
    await backendJson("/auth/logout", {
      method: "POST",
      body: { refreshToken: session.refreshToken },
    }).catch(() => undefined);
  }

  await deleteSession();
  redirect("/login?logout=1");
}

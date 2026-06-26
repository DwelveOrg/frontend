"use server";

import { redirect } from "next/navigation";
import {
  createWorkspaceSchema,
  loginSchema,
  regularSignupSchema,
} from "@/app/(authentication)/_types/_schemas";
import {
  backendJson,
  BackendApiError,
  type AuthResponse,
  type CreateWorkspaceResponse,
  type SignupResponse,
} from "./api";
import { createSession, deleteSession, getSession } from "./session";

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

export type CreateWorkspaceActionState = {
  error: string | null;
  success: boolean;
};

const INVALID_LOGIN_ERROR = "Invalid email or password.";
const INVALID_SIGNUP_ERROR = "Please check the form and try again.";
const INVALID_WORKSPACE_ERROR = "Please check the workspace details and try again.";
const NETWORK_ERROR = "Unable to reach Dwelve API. Please try again.";

function getActionError(error: unknown, fallback: string) {
  if (error instanceof BackendApiError) {
    return error.message;
  }

  if (error instanceof TypeError) {
    return NETWORK_ERROR;
  }

  return fallback;
}

async function createSessionFromAuthResponse(response: AuthResponse) {
  await createSession({
    userId: response.user.id,
    email: response.user.email,
    fullName: response.user.fullName,
    accessToken: response.tokens.accessToken,
    refreshToken: response.tokens.refreshToken,
    workspaceId: response.member?.workspaceId ?? response.workspace?.id,
    memberId: response.member?.id,
    workspaceRole: response.member?.role,
    membershipCount: response.memberships?.length ?? (response.member ? 1 : 0),
  });
}

async function createSessionFromWorkspaceResponse(response: CreateWorkspaceResponse) {
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
    workspaceId: membership.workspaceId,
    memberId: membership.id,
    workspaceRole: membership.role,
    membershipCount: Math.max(session.membershipCount ?? 0, 1),
  });
}

export async function login(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const parsed = loginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: INVALID_LOGIN_ERROR, success: false };
  }

  try {
    const response = await backendJson<AuthResponse>("/auth/login", {
      method: "POST",
      body: parsed.data,
    });

    await createSessionFromAuthResponse(response);

    return { error: null, success: true, redirectTo: "/dashboard" };
  } catch (error) {
    return { error: getActionError(error, INVALID_LOGIN_ERROR), success: false };
  }
}

export async function signup(
  _prevState: SignupActionState,
  formData: FormData,
): Promise<SignupActionState> {
  const parsed = regularSignupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: INVALID_SIGNUP_ERROR, success: false };
  }

  try {
    await backendJson<SignupResponse>("/auth/signup", {
      method: "POST",
      body: parsed.data,
    });

    const response = await backendJson<AuthResponse>("/auth/login", {
      method: "POST",
      body: {
        email: parsed.data.email,
        password: parsed.data.password,
      },
    });

    await createSessionFromAuthResponse(response);

    return { error: null, success: true, redirectTo: "/dashboard" };
  } catch (error) {
    return { error: getActionError(error, INVALID_SIGNUP_ERROR), success: false };
  }
}

export async function createWorkspace(
  _prevState: CreateWorkspaceActionState,
  formData: FormData,
): Promise<CreateWorkspaceActionState> {
  const parsed = createWorkspaceSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    phone: formData.get("phone") || undefined,
    address: formData.get("address") || undefined,
  });

  if (!parsed.success) {
    return { error: INVALID_WORKSPACE_ERROR, success: false };
  }

  const session = await getSession();

  if (!session?.accessToken) {
    return { error: "Please log in again to create a workspace.", success: false };
  }

  try {
    const response = await backendJson<CreateWorkspaceResponse>("/workspaces", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: parsed.data,
    });

    await createSessionFromWorkspaceResponse(response);

    return { error: null, success: true };
  } catch (error) {
    return { error: getActionError(error, INVALID_WORKSPACE_ERROR), success: false };
  }
}

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

import "server-only";

import { backendJson, type AuthResponse } from "./api";
import { createSession, getSession } from "./session";

/** Thrown when an authenticated request has no usable session / access token. */
export class SessionExpiredError extends Error {
  constructor(message = "Your session expired. Please log in again.") {
    super(message);
    this.name = "SessionExpiredError";
  }
}

async function refreshAccessToken(refreshToken: string) {
  const response = await backendJson<AuthResponse>("/auth/refresh", {
    method: "POST",
    body: { refreshToken },
  });

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

  return response.tokens.accessToken;
}

/**
 * Performs a backend request authenticated with the current session's access token.
 *
 * On a 401 response, attempts to refresh the token using the stored refresh token,
 * updates the session, and retries the request once.
 */
export async function authedBackendJson<TResponse>(
  path: string,
  init: Omit<RequestInit, "body"> & { body?: unknown } = {},
): Promise<TResponse> {
  const session = await getSession();

  if (!session?.accessToken) {
    throw new SessionExpiredError();
  }

  try {
    return await backendJson<TResponse>(path, {
      ...init,
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        ...init.headers,
      },
    });
  } catch (error) {
    const is401 =
      error instanceof Error &&
      (error.message.toLowerCase().includes("unauthorized") ||
        error.message.toLowerCase().includes("expired"));

    if (!is401 || !session.refreshToken) {
      throw error;
    }

    const newAccessToken = await refreshAccessToken(session.refreshToken);

    return backendJson<TResponse>(path, {
      ...init,
      headers: {
        Authorization: `Bearer ${newAccessToken}`,
        ...init.headers,
      },
    });
  }
}

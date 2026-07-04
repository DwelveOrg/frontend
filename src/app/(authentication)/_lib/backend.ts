import "server-only";

import { backendJson } from "./api";
import { createSession, getSession } from "./session";
import type { SessionPayload } from "../_types/auth";

/** Thrown when an authenticated request has no usable session / access token. */
export class SessionExpiredError extends Error {
  constructor(message = "Your session expired. Please log in again.") {
    super(message);
    this.name = "SessionExpiredError";
  }
}

/** `/auth/refresh` returns only a fresh token pair — no user/membership payload. */
type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

/**
 * Exchanges the refresh token for a new access token and rewrites the session.
 * The refresh endpoint does not return the user or memberships, so the existing
 * session's identity is preserved and only the tokens are rotated.
 */
async function refreshAccessToken(current: SessionPayload) {
  if (!current.refreshToken) {
    throw new SessionExpiredError();
  }

  const tokens = await backendJson<RefreshResponse>("/auth/refresh", {
    method: "POST",
    body: { refreshToken: current.refreshToken },
  });

  await createSession({
    userId: current.userId,
    email: current.email,
    fullName: current.fullName,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    schoolId: current.schoolId,
    memberId: current.memberId,
    schoolRole: current.schoolRole,
    membershipCount: current.membershipCount,
  });

  return tokens.accessToken;
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

    const newAccessToken = await refreshAccessToken(session);

    return backendJson<TResponse>(path, {
      ...init,
      headers: {
        Authorization: `Bearer ${newAccessToken}`,
        ...init.headers,
      },
    });
  }
}

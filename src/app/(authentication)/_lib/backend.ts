import "server-only";

import { backendJson } from "./api";
import { getSession } from "./session";

/** Thrown when an authenticated request has no usable session / access token. */
export class SessionExpiredError extends Error {
  constructor(message = "Your session expired. Please log in again.") {
    super(message);
    this.name = "SessionExpiredError";
  }
}

/**
 * Performs a backend request authenticated with the current session's access token.
 *
 * This is the single seam for authenticated server-to-backend calls: it reads the
 * httpOnly session cookie, attaches the Bearer token, and centralizes the "no
 * session" failure so callers never thread the token by hand. When the backend
 * exposes a token-refresh endpoint, the 401 -> refresh -> retry loop belongs here
 * so every caller inherits it for free.
 */
export async function authedBackendJson<TResponse>(
  path: string,
  init: Omit<RequestInit, "body"> & { body?: unknown } = {},
): Promise<TResponse> {
  const session = await getSession();

  if (!session?.accessToken) {
    throw new SessionExpiredError();
  }

  return backendJson<TResponse>(path, {
    ...init,
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      ...init.headers,
    },
  });
}

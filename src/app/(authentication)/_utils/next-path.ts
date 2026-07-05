/**
 * Resolves a post-auth redirect target from a `next` query value.
 *
 * Only root-relative in-app paths are allowed (must start with a single "/").
 * Absolute URLs, protocol-relative (`//host`), and backslash tricks are rejected
 * to prevent open-redirects to attacker-controlled destinations. Anything invalid
 * falls back to `fallback` (the dashboard by default).
 */
export function safeNextPath(
  next: string | null | undefined,
  fallback = "/dashboard",
): string {
  if (!next) {
    return fallback;
  }

  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return fallback;
  }

  return next;
}

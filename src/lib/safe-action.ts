import { createSafeActionClient } from "next-safe-action";

/**
 * Generic message surfaced to the client for any error that is not an explicit,
 * user-facing {@link ActionError}. Prevents internal/server error details
 * (stack traces, backend internals, config errors) from leaking to the browser.
 */
export const GENERIC_ACTION_ERROR = "Something went wrong. Please try again.";

/**
 * Marks an error whose message is safe to surface to the client. Server actions
 * should throw this (never a bare `Error`) when they want the user to see the
 * message — e.g. "Invalid email or password." Any other thrown error is masked.
 */
export class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionError";
  }
}

export const actionClient = createSafeActionClient({
  handleServerError(error) {
    // Only messages we explicitly marked as user-facing are returned verbatim.
    // Everything else is logged server-side and masked so we never leak
    // internal error details to the client.
    if (error instanceof ActionError) {
      return error.message;
    }

    console.error("Unhandled server action error:", error);
    return GENERIC_ACTION_ERROR;
  },
});

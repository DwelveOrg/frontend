import "server-only";

import type { z } from "zod";

import type { BackendRequestInit } from "@/lib/api/backend";
import { authedBackendJson } from "@/app/(authentication)/_lib/backend";
import { studentsResponseSchema } from "./students.schemas";

/**
 * Named endpoint functions for the students API. Every call goes through
 * `authedBackendJson` (attaches the session bearer token) and validates the
 * response with a Zod schema, per `docs/architecture/ARCHITECTURE.md`.
 */

type BackendRequester = <TSchema extends z.ZodTypeAny>(
  path: string,
  init: BackendRequestInit<TSchema>,
) => Promise<z.infer<TSchema>>;

/**
 * `GET /students` - ADMIN only. Returns the student roster for the currently
 * selected school session. See `docs/features/students-page-contract.md`.
 */
export function getStudentsRequest(requestJson: BackendRequester = authedBackendJson) {
  return requestJson("/students", { responseSchema: studentsResponseSchema });
}

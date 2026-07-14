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

/**
 * `DELETE /students/:studentId` - ADMIN only. `studentId` is the
 * `StudentProfile.id` (the roster item's `id`). Removes the student from the
 * selected school (deactivates membership, clears class rosters, marks
 * enrollments `REMOVED`) without deleting the global user account. The UI does
 * not consume the response body, so no response schema is attached.
 */
export function removeStudentFromSchoolRequest(
  studentId: string,
  requestJson: BackendRequester = authedBackendJson,
) {
  return requestJson(`/students/${studentId}`, { method: "DELETE" });
}

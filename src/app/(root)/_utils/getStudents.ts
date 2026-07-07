import "server-only";

import { authedBackendJson } from "@/app/(authentication)/_lib/backend";
import { getStudentsRequest } from "../_lib/students.api";
import type { StudentItem } from "../_lib/students.schemas";

/**
 * Fetches the student roster for the current school session (`GET /students`).
 * Backend enforces `ADMIN` only; callers should still gate on the viewer role
 * so we do not fire the request for teacher/student sessions. Fails soft:
 * returns an empty list on any error so pages render an empty state, not a
 * crash.
 */
export async function getStudents(): Promise<StudentItem[]> {
  try {
    const { students } = await getStudentsRequest(authedBackendJson);
    return students;
  } catch {
    return [];
  }
}

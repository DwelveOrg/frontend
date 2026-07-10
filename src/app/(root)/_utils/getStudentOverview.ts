import "server-only";

import { authedBackendJson } from "@/app/(authentication)/_lib/backend";
import { getStudentOverviewRequest } from "../_lib/enrollment.api";
import type { StudentOverviewResponse } from "../_lib/enrollment.schemas";

/**
 * Fetches the student-visible school overview counts
 * (`GET /schools/:schoolId/student-overview`). STUDENT-only on the backend, so
 * only call it for student sessions. Fails soft - returns `null` on any error
 * so the page can simply omit the overview strip instead of crashing.
 */
export async function getStudentOverview(
  schoolId: string,
): Promise<StudentOverviewResponse | null> {
  try {
    return await getStudentOverviewRequest(schoolId, authedBackendJson);
  } catch {
    return null;
  }
}

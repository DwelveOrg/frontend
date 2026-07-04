import "server-only";

import { authedBackendJson } from "@/app/(authentication)/_lib/backend";
import { getClassesRequest } from "../_lib/classes.api";
import type { ApiClass } from "../_lib/classes.schemas";

/**
 * Fetches the classes the current member may see (`GET /classes`). The backend
 * scopes the result by role: ADMIN gets the full school directory, TEACHER gets
 * classes they lead, STUDENT gets classes they are enrolled in. Fails soft -
 * returns an empty list on any error so pages render an empty state, not a crash.
 */
export async function getClasses(): Promise<ApiClass[]> {
  try {
    const { classes } = await getClassesRequest(authedBackendJson);
    return classes;
  } catch {
    return [];
  }
}

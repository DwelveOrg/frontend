import "server-only";

import { authedBackendJson } from "@/app/(authentication)/_lib/backend";
import { getClassRequest } from "../_lib/classes.api";
import type { ApiClass } from "../_lib/classes.schemas";

/**
 * Fetches a single class by id (`GET /classes/:id`). Returns `null` when the
 * backend rejects the request (404, 403 for non-permitted roles, etc.) so the
 * page renders a not-found state instead of a crash.
 */
export async function getClass(classId: string): Promise<ApiClass | null> {
  try {
    const { class: classItem } = await getClassRequest(classId, authedBackendJson);
    return classItem;
  } catch {
    return null;
  }
}

import "server-only";

import { authedBackendJson } from "@/app/(authentication)/_lib/backend";
import { getMyClassesRequest } from "../_lib/enrollment.api";
import type { ApiClass } from "../_lib/classes.schemas";

/**
 * Fetches the student's active roster classes (`GET /me/classes?status=ACTIVE`).
 * This is the My Classes source of truth: a student who joined a school is not
 * enrolled in every class, so only active roster entries belong here. Fails
 * soft - returns an empty list on any error so the page renders an empty state,
 * not a crash.
 */
export async function getMyClasses(): Promise<ApiClass[]> {
  try {
    const { classes } = await getMyClassesRequest(authedBackendJson);
    return classes;
  } catch {
    return [];
  }
}

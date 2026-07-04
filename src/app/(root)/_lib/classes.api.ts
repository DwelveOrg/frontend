import "server-only";

import type { z } from "zod";

import type { BackendRequestInit } from "@/lib/api/backend";
import { authedBackendJson } from "@/app/(authentication)/_lib/backend";
import { classDetailResponseSchema, classesResponseSchema } from "./classes.schemas";

/**
 * Named endpoint functions for the classes API. Every call goes through
 * `authedBackendJson` (attaches the session bearer token) and validates the
 * response with a Zod schema, per `docs/architecture/ARCHITECTURE.md`.
 */

type BackendRequester = <TSchema extends z.ZodTypeAny>(
  path: string,
  init: BackendRequestInit<TSchema>,
) => Promise<z.infer<TSchema>>;

export type CreateClassRequestBody = {
  name: string;
  gradeLevel?: string;
  description?: string;
};

/** `GET /classes` - backend returns only classes the caller may see. */
export function getClassesRequest(requestJson: BackendRequester = authedBackendJson) {
  return requestJson("/classes", { responseSchema: classesResponseSchema });
}

/** `POST /classes` - ADMIN only (enforced by the backend RolesGuard). */
export function createClassRequest(
  body: CreateClassRequestBody,
  requestJson: BackendRequester = authedBackendJson,
) {
  return requestJson("/classes", {
    method: "POST",
    body,
    responseSchema: classDetailResponseSchema,
  });
}

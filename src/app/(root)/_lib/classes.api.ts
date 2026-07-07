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

/** `GET /classes` - backend returns only classes the caller may see. */
export function getClassesRequest(requestJson: BackendRequester = authedBackendJson) {
  return requestJson("/classes", { responseSchema: classesResponseSchema });
}

/** `GET /classes/:id` - one class, visible to the caller. */
export function getClassRequest(
  classId: string,
  requestJson: BackendRequester = authedBackendJson,
) {
  return requestJson(`/classes/${classId}`, {
    responseSchema: classDetailResponseSchema,
  });
}

/** `POST /classes` - ADMIN only. Accepts multipart/form-data with optional picture. */
export function createClassRequest(
  body: FormData,
  requestJson: BackendRequester = authedBackendJson,
) {
  return requestJson("/classes", {
    method: "POST",
    body,
    responseSchema: classDetailResponseSchema,
  });
}

/** `PATCH /classes/:id` - ADMIN only. Accepts multipart/form-data. */
export function updateClassRequest(
  classId: string,
  body: FormData,
  requestJson: BackendRequester = authedBackendJson,
) {
  return requestJson(`/classes/${classId}`, {
    method: "PATCH",
    body,
    responseSchema: classDetailResponseSchema,
  });
}

/** `DELETE /classes/:id` - ADMIN only. Soft-deletes the class. */
export function deleteClassRequest(
  classId: string,
  requestJson: BackendRequester = authedBackendJson,
) {
  return requestJson(`/classes/${classId}`, {
    method: "DELETE",
  });
}

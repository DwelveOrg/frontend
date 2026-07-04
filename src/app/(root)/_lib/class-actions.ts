"use server";

import { actionClient, ActionError } from "@/lib/safe-action";
import { authedBackendJson } from "@/app/(authentication)/_lib/backend";
import {
  BackendApiError,
  BackendResponseValidationError,
} from "@/lib/api/backend";
import { createClassRequest, type CreateClassRequestBody } from "./classes.api";
import { createClassSchema } from "./actions.schemas";

const INVALID_CLASS_ERROR = "Please check the class details and try again.";
const NETWORK_ERROR = "Unable to reach Dwelve API. Please try again.";

function getActionError(error: unknown, fallback: string) {
  if (error instanceof BackendApiError) {
    return error.message;
  }
  if (error instanceof TypeError) {
    return NETWORK_ERROR;
  }
  if (error instanceof BackendResponseValidationError) {
    console.error("Backend response validation error:", error);
    return fallback;
  }
  console.error("Class action error:", error);
  return fallback;
}

export const createClassAction = actionClient
  .inputSchema(createClassSchema)
  .action(async ({ parsedInput }) => {
    try {
      // Drop empty optionals so the backend only receives meaningful values.
      // schoolId is derived server-side from the session, never sent by the client.
      const body: CreateClassRequestBody = { name: parsedInput.name };
      for (const key of ["gradeLevel", "description"] as const) {
        const value = parsedInput[key]?.trim();
        if (value) {
          body[key] = value;
        }
      }

      const { class: created } = await createClassRequest(body, authedBackendJson);

      return { id: created.id, name: created.name };
    } catch (error) {
      throw new ActionError(getActionError(error, INVALID_CLASS_ERROR));
    }
  });

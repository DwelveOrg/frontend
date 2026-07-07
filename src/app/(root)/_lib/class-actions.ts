"use server";

import { actionClient, ActionError } from "@/lib/safe-action";
import { authedBackendJson } from "@/app/(authentication)/_lib/backend";
import {
  BackendApiError,
  BackendResponseValidationError,
} from "@/lib/api/backend";
import {
  createClassRequest,
  deleteClassRequest,
  updateClassRequest,
} from "./classes.api";
import {
  createClassSchema,
  deleteClassSchema,
  updateClassSchema,
} from "./actions.schemas";

const INVALID_CLASS_ERROR = "Please check the class details and try again.";
const NETWORK_ERROR = "Unable to reach Dwelve API. Please try again.";
const DELETE_ERROR = "Could not delete the class. Please try again.";

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

function appendText(form: FormData, key: string, value: string | undefined | null) {
  const trimmed = value?.trim();
  if (trimmed) {
    form.append(key, trimmed);
  }
}

export const createClassAction = actionClient
  .inputSchema(createClassSchema)
  .action(async ({ parsedInput }) => {
    try {
      const form = new FormData();
      form.append("name", parsedInput.name.trim());
      appendText(form, "description", parsedInput.description);
      if (parsedInput.picture) {
        form.append("picture", parsedInput.picture);
      }

      const { class: created } = await createClassRequest(form, authedBackendJson);
      return { id: created.id, name: created.name };
    } catch (error) {
      throw new ActionError(getActionError(error, INVALID_CLASS_ERROR));
    }
  });

export const updateClassAction = actionClient
  .inputSchema(updateClassSchema)
  .action(async ({ parsedInput }) => {
    try {
      const form = new FormData();
      appendText(form, "name", parsedInput.name);
      appendText(form, "description", parsedInput.description);
      if (typeof parsedInput.isActive === "boolean") {
        form.append("isActive", String(parsedInput.isActive));
      }
      if (parsedInput.picture) {
        form.append("picture", parsedInput.picture);
      }
      if (parsedInput.removePicture) {
        form.append("removePicture", "true");
      }

      const { class: updated } = await updateClassRequest(
        parsedInput.classId,
        form,
        authedBackendJson,
      );
      return { id: updated.id, name: updated.name };
    } catch (error) {
      throw new ActionError(getActionError(error, INVALID_CLASS_ERROR));
    }
  });

export const deleteClassAction = actionClient
  .inputSchema(deleteClassSchema)
  .action(async ({ parsedInput }) => {
    try {
      await deleteClassRequest(parsedInput.classId, authedBackendJson);
      return { id: parsedInput.classId };
    } catch (error) {
      throw new ActionError(getActionError(error, DELETE_ERROR));
    }
  });

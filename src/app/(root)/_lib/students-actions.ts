"use server";

import { actionClient, ActionError } from "@/lib/safe-action";
import { authedBackendJson } from "@/app/(authentication)/_lib/backend";
import {
  BackendApiError,
  BackendResponseValidationError,
} from "@/lib/api/backend";
import { removeStudentFromSchoolRequest } from "./students.api";
import { removeSchoolStudentSchema } from "./actions.schemas";

const REMOVE_ERROR = "Could not remove the student. Please try again.";
const NETWORK_ERROR = "Unable to reach Dwelve API. Please try again.";

function getActionError(error: unknown, fallback: string) {
  if (error instanceof BackendApiError) {
    return error.message;
  }
  if (error instanceof TypeError) {
    return NETWORK_ERROR;
  }
  if (error instanceof BackendResponseValidationError) {
    console.error("Students response validation error:", error);
    return fallback;
  }
  console.error("Students action error:", error);
  return fallback;
}

/**
 * `DELETE /students/:studentId` - removes a student from the currently selected
 * school (admin only; the backend re-checks the role). Distinct from the
 * class-level `removeStudentAction` in `enrollment-actions.ts`.
 */
export const removeStudentFromSchoolAction = actionClient
  .inputSchema(removeSchoolStudentSchema)
  .action(async ({ parsedInput }) => {
    try {
      await removeStudentFromSchoolRequest(parsedInput.studentId, authedBackendJson);
      return { studentId: parsedInput.studentId };
    } catch (error) {
      throw new ActionError(getActionError(error, REMOVE_ERROR));
    }
  });

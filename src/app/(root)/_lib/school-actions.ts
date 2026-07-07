"use server";

import { actionClient, ActionError } from "@/lib/safe-action";
import { authedBackendJson } from "@/app/(authentication)/_lib/backend";
import {
  BackendApiError,
  BackendResponseValidationError,
  createTeacherInviteRequest,
  updateSchoolRequest,
} from "@/app/(authentication)/_lib/api";
import { getUser } from "../_utils/getUser";
import { inviteTeacherSchema, updateSchoolSchema } from "./actions.schemas";

const INVALID_INVITE_ERROR = "Could not create the invite. Please try again.";
const INVALID_UPDATE_ERROR = "Could not update the school. Please try again.";
const NETWORK_ERROR = "Unable to reach Dwelve API. Please try again.";
const NO_SCHOOL_ERROR = "You must select a school before inviting teachers.";

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
  console.error("School action error:", error);
  return fallback;
}

export const inviteTeacherAction = actionClient
  .inputSchema(inviteTeacherSchema)
  .action(async ({ parsedInput }) => {
    // schoolId comes from the trusted session, never the client, so a member can
    // only invite into their own active school.
    const user = await getUser();
    if (!user?.schoolId) {
      throw new ActionError(NO_SCHOOL_ERROR);
    }

    try {
      const { invite } = await createTeacherInviteRequest(
        user.schoolId,
        { email: parsedInput.email },
        authedBackendJson,
      );

      return {
        invitedEmail: invite.invitedEmail,
        inviteUrl: invite.inviteUrl,
        expiresAt: String(invite.expiresAt),
      };
    } catch (error) {
      throw new ActionError(getActionError(error, INVALID_INVITE_ERROR));
    }
  });

function appendText(form: FormData, key: string, value: string | undefined | null) {
  const trimmed = value?.trim();
  if (trimmed) {
    form.append(key, trimmed);
  }
}

export const updateSchoolAction = actionClient
  .inputSchema(updateSchoolSchema)
  .action(async ({ parsedInput }) => {
    const user = await getUser();
    if (!user?.schoolId) {
      throw new ActionError(NO_SCHOOL_ERROR);
    }

    try {
      const form = new FormData();
      form.append("name", parsedInput.name.trim());
      appendText(form, "description", parsedInput.description);
      appendText(form, "country", parsedInput.country);
      appendText(form, "city", parsedInput.city);
      if (parsedInput.logo) {
        form.append("logo", parsedInput.logo);
      }
      if (parsedInput.removeLogo) {
        form.append("removeLogo", "true");
      }

      const { school } = await updateSchoolRequest(
        user.schoolId,
        form,
        authedBackendJson,
      );

      return school;
    } catch (error) {
      throw new ActionError(getActionError(error, INVALID_UPDATE_ERROR));
    }
  });

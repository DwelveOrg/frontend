"use server";

import { redirect } from "next/navigation";

import { actionClient, ActionError } from "@/lib/safe-action";
import { authedBackendJson } from "@/app/(authentication)/_lib/backend";
import {
  BackendApiError,
  BackendResponseValidationError,
  createTeacherInviteRequest,
  deleteSchoolRequest,
  updateSchoolRequest,
} from "@/app/(authentication)/_lib/api";
import { createSession, getSession } from "@/app/(authentication)/_lib/session";
import { getProfileRequest } from "./profile.api";
import { getUser } from "../_utils/getUser";
import {
  deleteSchoolSchema,
  inviteTeacherSchema,
  updateSchoolSchema,
} from "./actions.schemas";

const INVALID_INVITE_ERROR = "Could not create the invite. Please try again.";
const INVALID_UPDATE_ERROR = "Could not update the school. Please try again.";
const DELETE_SCHOOL_ERROR = "Could not delete the school. Please try again.";
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

/**
 * After deleting the selected school, the encrypted session still points at it
 * (and the access token still carries its now-inactive `schoolId` claim). Rebuild
 * the cookie from a fresh profile: adopt whatever school the backend still has
 * selected, or clear the school context entirely. Unlike `syncSessionFromProfile`
 * in profile-actions, this must NOT fall back to the old `session.schoolId`.
 */
async function clearSelectedSchoolSession() {
  const session = await getSession();
  if (!session?.userId) return;

  let selected: Awaited<ReturnType<typeof getProfileRequest>>["selectedSchool"] = null;
  let membershipCount = Math.max((session.membershipCount ?? 1) - 1, 0);

  try {
    const profile = await getProfileRequest(authedBackendJson);
    selected = profile.selectedSchool;
    membershipCount = profile.memberships.length;
  } catch {
    // Fall back to the conservative cleared state computed above.
  }

  await createSession({
    userId: session.userId,
    email: session.email,
    fullName: session.fullName,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    schoolId: selected?.school.id,
    memberId: selected?.member.id,
    schoolRole: selected?.member.role,
    membershipCount,
  });
}

export const deleteSchoolAction = actionClient
  .inputSchema(deleteSchoolSchema)
  .action(async () => {
    // schoolId comes from the trusted session, never the client, so an admin can
    // only delete their own selected school. The backend re-checks ADMIN.
    const user = await getUser();
    if (!user?.schoolId) {
      throw new ActionError(NO_SCHOOL_ERROR);
    }

    try {
      await deleteSchoolRequest(user.schoolId, authedBackendJson);
    } catch (error) {
      throw new ActionError(getActionError(error, DELETE_SCHOOL_ERROR));
    }

    // Re-sync + redirect run outside the try/catch so Next.js can handle its
    // internal NEXT_REDIRECT throw (mirrors revokeSessionAction).
    await clearSelectedSchoolSession();
    redirect("/dashboard");
  });

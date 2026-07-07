import "server-only";

import { authedBackendJson } from "@/app/(authentication)/_lib/backend";
import { getUser } from "./getUser";
import { getProfileRequest } from "../_lib/profile.api";
import type { ProfileResponse } from "../_lib/profile.schemas";

/**
 * Fetches the current account's profile bootstrap (`GET /profile`). See
 * `docs/features/profile-page-contract.md`. Fails soft — returns `null` on any
 * error so the profile page can render an empty state instead of crashing the
 * authenticated shell.
 *
 * DEV BRIDGE: while the backend `/profile` route is still shipping (returns 404
 * today), synthesize the payload from the session identity + selected school in
 * development only, so the page can be previewed end-to-end. Remove this
 * fallback once the backend exposes `GET /profile`.
 */
export async function getProfile(): Promise<ProfileResponse | null> {
  try {
    return await getProfileRequest(authedBackendJson);
  } catch {
    if (process.env.NODE_ENV !== "production") {
      return synthesizeProfileFromSession();
    }
    return null;
  }
}

async function synthesizeProfileFromSession(): Promise<ProfileResponse | null> {
  const user = await getUser();
  if (!user) return null;

  const now = new Date().toISOString();
  const hasSelected = Boolean(user.schoolId && user.memberId && user.schoolRole);

  return {
    account: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      avatarUrl: null,
      isActive: true,
      authMethods: { password: true, google: false },
      createdAt: now,
      updatedAt: now,
    },
    selectedSchool: hasSelected
      ? {
          school: {
            id: user.schoolId!,
            name: user.fullName,
            isActive: true,
            createdAt: now,
            updatedAt: now,
          },
          member: {
            id: user.memberId!,
            userId: user.id,
            schoolId: user.schoolId!,
            role: user.schoolRole!,
            isActive: true,
            createdAt: now,
            updatedAt: now,
          },
          roleProfile:
            user.schoolRole === "ADMIN"
              ? { type: "ADMIN" }
              : user.schoolRole === "TEACHER"
                ? {
                    type: "TEACHER",
                    teacherId: user.memberId!,
                    phone: null,
                    bio: null,
                    classes: [],
                    classCount: 0,
                  }
                : {
                    type: "STUDENT",
                    studentId: user.memberId!,
                    studentCode: null,
                    phone: null,
                    classes: [],
                    classCount: 0,
                  },
        }
      : null,
    memberships: [],
    notificationStatus: { hasUnread: false, unreadCount: 0 },
  };
}

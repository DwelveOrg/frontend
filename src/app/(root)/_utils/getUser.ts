import "server-only";
import { cookies } from "next/headers";
import { decrypt } from "@/app/(authentication)/_lib/session";
import { SESSION_COOKIE_NAME } from "@/app/(authentication)/_constants/session";
import type { AuthUser } from "@/app/(authentication)/_types/auth";

export type SessionUser = AuthUser;

export async function getUser(): Promise<SessionUser | null> {
  try {
    const cookie = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    const session = await decrypt(cookie);

    if (!session?.userId) {
      return null;
    }

    return {
      id: String(session.userId),
      email: session.email,
      fullName: session.fullName,
      schoolId: session.schoolId,
      memberId: session.memberId,
      schoolRole: session.schoolRole,
      membershipCount: session.membershipCount ?? 0,
    };
  } catch {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Unable to read the current user session.");
    }

    return null;
  }
}

import "server-only";
import { cookies } from "next/headers";
import { decrypt } from "@/app/(authentication)/_lib/session";
import { findDemoUserById } from "@/app/(authentication)/_lib/demo-users";
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

    if (session.role || session.name || session.identifier) {
      return {
        id: String(session.userId),
        identifier: session.identifier ?? "",
        name: session.name ?? "",
        role: session.role ?? "student",
      };
    }

    const seeded = findDemoUserById(String(session.userId));
    if (seeded) {
      return {
        id: seeded.id,
        identifier: seeded.identifier,
        name: seeded.name,
        role: seeded.role,
      };
    }

    return null;
  } catch {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Unable to read the current user session.");
    }

    return null;
  }
}

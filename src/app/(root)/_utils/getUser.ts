import "server-only";
import { cookies } from "next/headers";
import { decrypt } from "@/app/(authentication)/_lib/session";
import { testUsers } from "@/app/(authentication)/_constants";

export type SessionUser = {
  id: string;
  identifier: string;
  name: string;
  role: string;
};

export async function getUser(): Promise<SessionUser | null> {
  try {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    if (!session?.userId) {
      return null;
    }

    // Existing seeded accounts keep resolving exactly as before.
    const seeded = testUsers.find((user) => user.id === String(session.userId));
    if (seeded) {
      return {
        id: seeded.id,
        identifier: seeded.identifier,
        name: seeded.name,
        role: seeded.role,
      };
    }

    // Self-service signups are not seeded: rebuild them from the session.
    if (session.role || session.name) {
      return {
        id: String(session.userId),
        identifier: session.identifier ?? "",
        name: session.name ?? "",
        role: session.role ?? "student",
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

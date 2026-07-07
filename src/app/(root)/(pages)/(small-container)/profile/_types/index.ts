import type { AuthUser } from "@/app/(authentication)/_types/auth";
import type { ProfileResponse } from "@/app/(root)/_lib/profile.schemas";

export type ProfileUser = AuthUser;

export type ProfileClientProps = {
  user: ProfileUser | null;
  profile: ProfileResponse | null;
};

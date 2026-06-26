import type { AuthUser } from "@/app/(authentication)/_types/auth";

export type ProfileUser = AuthUser;

export type ProfileClientProps = {
  user: ProfileUser | null;
};

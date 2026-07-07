import ProfileClient from "./profile.client";
import { getUser } from "@/app/(root)/_utils/getUser";
import { getProfile } from "@/app/(root)/_utils/getProfile";

export default async function Page() {
  const [user, profile] = await Promise.all([getUser(), getProfile()]);
  return <ProfileClient key={user?.id ?? "guest"} user={user} profile={profile} />;
}

import { getUser } from "@/app/(root)/_utils/getUser";
import SettingsClient from "./settings.client";

export default async function Settings() {
  const user = await getUser();
  return <SettingsClient user={user} />;
}

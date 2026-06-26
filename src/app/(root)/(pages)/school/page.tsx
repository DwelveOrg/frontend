import RoleEmptyState from "../_components/ui/RoleEmptyState";
import { getUser } from "../../_utils/getUser";

export default async function Page() {
  const user = await getUser();

  return (
    <div className="flex min-h-[calc(100dvh-12rem)] w-full items-center justify-center">
      <RoleEmptyState role={user?.workspaceRole} entity="school" />
    </div>
  );
}

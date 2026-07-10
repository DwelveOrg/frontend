import { redirect } from "next/navigation";

import RoleEmptyState from "../../_components/ui/RoleEmptyState";
import { getUser } from "../../../_utils/getUser";
import DiscoverClassesView from "../_components/DiscoverClassesView";

/**
 * Discover Classes is a student surface. Admins/teachers manage classes from
 * the school directory instead, so send them there; users without a membership
 * see the join/create entry point.
 */
export default async function Page() {
  const user = await getUser();

  if (!user?.membershipCount) {
    return (
      <div className="flex min-h-[calc(100dvh-12rem)] w-full items-center justify-center">
        <RoleEmptyState role={user?.schoolRole} entity="class" />
      </div>
    );
  }

  if (user.schoolRole !== "STUDENT") {
    redirect("/groups");
  }

  return <DiscoverClassesView schoolId={user.schoolId} />;
}

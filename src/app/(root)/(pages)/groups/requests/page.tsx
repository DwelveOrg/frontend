import { redirect } from "next/navigation";

import RoleEmptyState from "../../_components/ui/RoleEmptyState";
import { getUser } from "../../../_utils/getUser";
import MyClassRequestsView from "../_components/MyClassRequestsView";

/**
 * Pending Requests is a student surface listing the viewer's own join
 * requests. Non-students manage requests per class from the class requests page.
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

  return <MyClassRequestsView schoolId={user.schoolId} />;
}

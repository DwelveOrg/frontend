import RoleEmptyState from "../_components/ui/RoleEmptyState";
import { getUser } from "../../_utils/getUser";
import { getSchool } from "../../_utils/getSchool";
import ClassesView from "./_components/ClassesView";

export default async function Page() {
  const user = await getUser();

  // No membership yet — keep the join/create entry point instead of an empty grid.
  if (!user?.membershipCount) {
    return (
      <div className="flex min-h-[calc(100dvh-12rem)] w-full items-center justify-center">
        <RoleEmptyState role={user?.schoolRole} entity="class" />
      </div>
    );
  }

  const detail = user.schoolId ? await getSchool(user.schoolId) : null;
  const school = detail?.school;
  const role = detail?.currentUserRole ?? user.schoolRole ?? null;
  const isAdmin = role === "ADMIN" || role === "OWNER" || role === "DIRECTOR";

  return (
    <ClassesView
      schoolName={school?.name ?? ""}
      schoolDescription={school?.description}
      isAdmin={isAdmin}
      studentJoinCode={school?.studentJoinCode}
    />
  );
}

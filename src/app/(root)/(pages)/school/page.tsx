import RoleEmptyState from "../_components/ui/RoleEmptyState";
import { getUser } from "../../_utils/getUser";
import { getSchool } from "../../_utils/getSchool";
import SchoolInfoCard from "./_components/SchoolInfoCard";

export default async function Page() {
  const user = await getUser();
  const detail = user?.schoolId ? await getSchool(user.schoolId) : null;

  if (!detail) {
    return (
      <div className="flex min-h-[calc(100dvh-12rem)] w-full items-center justify-center">
        <RoleEmptyState role={user?.schoolRole} entity="school" />
      </div>
    );
  }

  const { school, currentUserRole } = detail;
  const location = [school.city, school.country].filter(Boolean).join(", ") || null;
  const isAdmin = currentUserRole === "ADMIN" || currentUserRole === "OWNER" || currentUserRole === "DIRECTOR";

  return (
    <section className="py-6">
      <SchoolInfoCard
        name={school.name}
        description={school.description}
        location={location}
        studentJoinCode={school.studentJoinCode}
        isAdmin={isAdmin}
        isActive={school.isActive}
      />
    </section>
  );
}

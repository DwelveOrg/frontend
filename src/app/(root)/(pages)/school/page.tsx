import RoleEmptyState from "../_components/ui/RoleEmptyState";
import { getUser } from "../../_utils/getUser";
import { getSchool } from "../../_utils/getSchool";
import { getSchoolMembers } from "../../_utils/getSchoolMembers";
import { getClasses } from "../../_utils/getClasses";
import { toClassCardItem } from "../groups/_lib/mapClass";
import SchoolProfileHeader from "./_components/SchoolProfileHeader";
import SchoolClassesSection from "./_components/SchoolClassesSection";

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
  const isAdmin = currentUserRole === "ADMIN";
  const location = [school.city, school.country].filter(Boolean).join(", ") || null;

  const [classes, schoolMembers] = await Promise.all([
    getClasses(),
    user?.schoolId ? getSchoolMembers(user.schoolId) : null,
  ]);
  const items = classes.map((item) => toClassCardItem(item, user?.memberId));

  return (
    <section className="flex flex-col gap-6 py-6">
      <SchoolProfileHeader
        name={school.name}
        description={school.description}
        country={school.country}
        city={school.city}
        logoUrl={school.logoUrl}
        location={location}
        isActive={school.isActive}
        classCount={classes.length}
        studentCount={schoolMembers?.counts.students ?? 0}
        teacherCount={schoolMembers?.counts.teachers ?? 0}
        isAdmin={isAdmin}
        role={currentUserRole}
        studentJoinCode={school.studentJoinCode}
      />

      <SchoolClassesSection items={items} isAdmin={isAdmin} />
    </section>
  );
}

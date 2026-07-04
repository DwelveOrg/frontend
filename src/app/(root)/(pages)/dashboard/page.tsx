import { getUser } from "../../_utils/getUser";
import { getSchool } from "../../_utils/getSchool";
import NoMembershipState from "./_components/NoMembershipState";
import SchoolDashboardHeader from "./_components/SchoolDashboardHeader";
import DashboardStats from "./_components/DashboardStats";
import { WelcomeGreeting } from "./_components/WelcomeGreeting";

export default async function Dashboard() {
  const user = await getUser();

  if (!user?.membershipCount) {
    return <NoMembershipState />;
  }

  const detail = user.schoolId ? await getSchool(user.schoolId) : null;

  if (!detail) {
    return <div className="min-h-[40vh]" />;
  }

  const { school, currentUserRole } = detail;
  const location = [school.city, school.country].filter(Boolean).join(", ") || null;

  return (
    <div className="space-y-6">
      <WelcomeGreeting fullName={user.fullName ?? null} />
      <SchoolDashboardHeader
        name={school.name}
        description={school.description}
        location={location}
        studentJoinCode={school.studentJoinCode}
        isAdmin={currentUserRole === "ADMIN"}
      />
      <DashboardStats />
    </div>
  );
}

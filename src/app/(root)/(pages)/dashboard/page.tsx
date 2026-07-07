import { getUser } from "../../_utils/getUser";
import { getSchool } from "../../_utils/getSchool";
import NoMembershipState from "./_components/NoMembershipState";
import DashboardHeader from "./_components/DashboardHeader";
import StatCards from "./_components/StatCards";
import GradeTrendChart from "./_components/GradeTrendChart";
import UpcomingPanel from "./_components/UpcomingPanel";
import RecentActivity from "./_components/RecentActivity";

export default async function Dashboard() {
  const user = await getUser();

  if (!user?.membershipCount) {
    return <NoMembershipState />;
  }

  // Fails soft: if the school fetch errors we still render the dashboard using
  // the role carried in the session, rather than blanking the whole page.
  const detail = user.schoolId ? await getSchool(user.schoolId) : null;
  const role = detail?.currentUserRole ?? user.schoolRole;
  const isAdmin = role === "ADMIN";
  const studentJoinCode = detail?.school.studentJoinCode ?? null;

  return (
    <div className="space-y-6">
      <DashboardHeader
        fullName={user.fullName ?? null}
        studentJoinCode={studentJoinCode}
        isAdmin={isAdmin}
      />

      <StatCards role={role} />

      <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
        <div className="lg:col-span-2">
          <GradeTrendChart role={role} />
        </div>
        <UpcomingPanel />
      </div>

      <RecentActivity />
    </div>
  );
}

import { getUser } from "../../_utils/getUser";
import NoMembershipState from "./_components/NoMembershipState";

export default async function Dashboard() {
  const user = await getUser();

  if (!user?.membershipCount) {
    return <NoMembershipState />;
  }

  return <div className="min-h-[40vh]" />;
}

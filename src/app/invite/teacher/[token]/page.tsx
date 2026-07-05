import { getSession } from "@/app/(authentication)/_lib/session";
import InviteAcceptClient from "./invite-accept-client";

type TeacherInvitePageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function TeacherInvitePage({ params }: TeacherInvitePageProps) {
  const { token } = await params;
  const session = await getSession();

  return (
    <InviteAcceptClient
      token={token}
      isAuthenticated={Boolean(session?.userId)}
      email={session?.email}
    />
  );
}

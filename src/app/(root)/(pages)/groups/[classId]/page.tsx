import { notFound } from "next/navigation";

import { getUser } from "../../../_utils/getUser";
import { getClass } from "../../../_utils/getClass";
import { getStudents } from "../../../_utils/getStudents";
import ClassDetailView from "./_components/ClassDetailView";

type PageProps = {
  params: Promise<{ classId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { classId } = await params;
  const user = await getUser();

  const classItem = await getClass(classId);
  if (!classItem) {
    notFound();
  }

  const viewerRole = user?.schoolRole ?? null;
  const isAdmin = viewerRole === "ADMIN";

  // The assign-student picker needs the school roster, which is admin-only
  // (`GET /students`), so only fetch it for admins.
  const students = isAdmin ? await getStudents() : [];

  return (
    <ClassDetailView
      classItem={classItem}
      isAdmin={isAdmin}
      viewerRole={viewerRole}
      students={students}
    />
  );
}

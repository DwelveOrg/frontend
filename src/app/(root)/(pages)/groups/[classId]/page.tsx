import { notFound } from "next/navigation";

import { getUser } from "../../../_utils/getUser";
import { getClass } from "../../../_utils/getClass";
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

  return <ClassDetailView classItem={classItem} isAdmin={isAdmin} viewerRole={viewerRole} />;
}

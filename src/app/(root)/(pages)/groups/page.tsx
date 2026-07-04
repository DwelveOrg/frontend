import RoleEmptyState from "../_components/ui/RoleEmptyState";
import { getUser } from "../../_utils/getUser";
import { getClasses } from "../../_utils/getClasses";
import ClassesView from "./_components/ClassesView";
import { toClassCardItem } from "./_lib/mapClass";

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

  // The backend scopes `GET /classes` by role, so this is already the viewer's
  // personal list (enrolled/led) — never the whole school directory.
  const classes = await getClasses();
  const items = classes.map((item) => toClassCardItem(item, user.memberId));

  return <ClassesView items={items} role={user.schoolRole ?? null} />;
}

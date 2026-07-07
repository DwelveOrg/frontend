import type { ApiClass } from "@/app/(root)/_lib/classes.schemas";
import type { ClassItem, ClassViewerRole } from "../_types";

/**
 * Maps a backend class (`ClassesService.sanitizeClass`) into the card view model.
 * `viewerMemberId` is the current user's `memberId`; it lets each card show whether
 * the viewer teaches or is enrolled in the class.
 */
export function toClassCardItem(apiClass: ApiClass, viewerMemberId?: string): ClassItem {
  const leadTeacher = apiClass.teachers[0]?.fullName ?? "";
  const studentCount = apiClass.counts?.students ?? apiClass.students.length;

  return {
    id: apiClass.id,
    name: apiClass.name,
    description: apiClass.description ?? "",
    pictureUrl: apiClass.pictureUrl ?? null,
    teacher: leadTeacher,
    studentCount,
    status: apiClass.isActive ? "active" : "archived",
    viewerRole: resolveViewerRole(apiClass, viewerMemberId),
  };
}

function resolveViewerRole(apiClass: ApiClass, viewerMemberId?: string): ClassViewerRole {
  if (!viewerMemberId) return null;
  if (apiClass.teachers.some((person) => person.memberId === viewerMemberId)) {
    return "teacher";
  }
  if (apiClass.students.some((person) => person.memberId === viewerMemberId)) {
    return "student";
  }
  return null;
}

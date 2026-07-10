"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  FileText,
  GraduationCap,
  Inbox,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserPlus,
  Users,
  UserCog,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import type { SchoolRole } from "@/app/(authentication)/_types/auth";
import type { ApiClass, ApiClassPerson } from "@/app/(root)/_lib/classes.schemas";
import type { StudentItem } from "@/app/(root)/_lib/students.schemas";
import { useRemoveStudentMutation } from "@/app/(root)/_hooks/useEnrollment";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { classAccent } from "../../_constants";
import EditClassDialog from "../../_components/EditClassDialog";
import DeleteClassDialog from "../../_components/DeleteClassDialog";
import AssignStudentDialog from "./AssignStudentDialog";

type ClassDetailViewProps = {
  classItem: ApiClass;
  isAdmin: boolean;
  viewerRole: SchoolRole | null;
  /** Assignable school students, admin-only; empty for teachers/students. */
  students: StudentItem[];
};

export default function ClassDetailView({
  classItem,
  isAdmin,
  viewerRole,
  students,
}: ClassDetailViewProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const removeStudent = useRemoveStudentMutation();

  // Teachers may manage rosters/requests for their assigned classes too, but
  // the school-wide student picker relies on the admin-only `GET /students`.
  const canManage = isAdmin || viewerRole === "TEACHER";

  const teacherCount = classItem.counts?.teachers ?? classItem.teachers.length;
  const studentCount = classItem.counts?.students ?? classItem.students.length;
  const initial = classItem.name.charAt(0).toUpperCase();
  const accent = classAccent(classItem.id);

  const notifySoon = (labelKey: string) =>
    toast.info(t("root.classDetail.actions.comingSoon", { action: t(labelKey) }));

  const handleRemoveStudent = (studentProfileId: string, name: string) => {
    removeStudent.mutate(
      { classId: classItem.id, studentId: studentProfileId },
      {
        onSuccess: () => {
          toast.success(t("root.enrollment.assign.removedToast", { name }));
          // Roster is server-rendered, so pull the fresh list in.
          router.refresh();
        },
        onError: (error) =>
          toast.error(error instanceof Error ? error.message : t("root.enrollment.errorGeneric")),
      },
    );
  };

  return (
    <section className="flex flex-col gap-6 py-6">
      <Link
        href="/groups"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("root.classDetail.back")}
      </Link>

      <header className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6">
        <div className="flex flex-wrap items-start gap-4">
          {classItem.pictureUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={classItem.pictureUrl}
              alt=""
              className="h-16 w-16 shrink-0 rounded-2xl object-cover"
            />
          ) : (
            <span
              className={`inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold ${accent}`}
            >
              {initial}
            </span>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-xl font-bold text-[var(--foreground)] sm:text-2xl">
                {classItem.name}
              </h1>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  classItem.isActive
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                }`}
              >
                {classItem.isActive
                  ? t("root.classes.status.active")
                  : t("root.classes.status.archived")}
              </span>
            </div>

            {classItem.description ? (
              <p className="mt-1 max-w-prose text-sm text-[var(--muted-foreground)]">
                {classItem.description}
              </p>
            ) : null}

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[var(--muted-foreground)]">
              <span className="inline-flex items-center gap-1.5">
                <UserCog className="h-3.5 w-3.5" />
                <span className="font-semibold text-[var(--foreground)]">{teacherCount}</span>
                {t("root.classes.stats.teachers")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                <span className="font-semibold text-[var(--foreground)]">{studentCount}</span>
                {t("root.classes.stats.students")}
              </span>
              {viewerRole ? (
                <span className="rounded-full border border-[var(--border)] bg-[var(--background)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--muted-foreground)]">
                  {t("root.schoolPage.viewingAs", {
                    role: t(`root.schoolPage.roles.${viewerRole.toLowerCase()}`),
                  })}
                </span>
              ) : null}
            </div>
          </div>

          {canManage ? (
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="lg" asChild>
                <Link href={`/groups/${classItem.id}/requests`}>
                  <Inbox className="h-4 w-4" />
                  {t("root.enrollment.classDetail.requests")}
                </Link>
              </Button>

              {isAdmin ? (
                <>
              <Button variant="outline" size="lg" onClick={() => setEditOpen(true)}>
                <Pencil className="h-4 w-4" />
                {t("root.classDetail.actions.edit")}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="lg">
                    <MoreHorizontal className="h-4 w-4" />
                    {t("root.classDetail.actions.more")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem
                    onSelect={() => notifySoon("root.classDetail.actions.addTest")}
                  >
                    <FileText className="h-4 w-4" />
                    {t("root.classDetail.actions.addTest")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => notifySoon("root.classDetail.actions.addExam")}
                  >
                    <GraduationCap className="h-4 w-4" />
                    {t("root.classDetail.actions.addExam")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setDeleteOpen(true)}
                    className="text-[var(--destructive)] focus:text-[var(--destructive)]"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t("root.classDetail.actions.delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <PeopleCard
          title={t("root.classDetail.teachers.title", { count: teacherCount })}
          emptyLabel={t("root.classDetail.teachers.empty")}
          icon={<UserCog className="h-4 w-4" />}
          people={classItem.teachers}
        />
        <PeopleCard
          title={t("root.classDetail.students.title", { count: studentCount })}
          emptyLabel={t("root.classDetail.students.empty")}
          icon={<Users className="h-4 w-4" />}
          people={classItem.students}
          headerAction={
            isAdmin ? (
              <Button size="sm" variant="outline" onClick={() => setAssignOpen(true)}>
                <UserPlus className="h-3.5 w-3.5" />
                {t("root.enrollment.assign.add")}
              </Button>
            ) : null
          }
          onRemove={
            canManage
              ? (person) => handleRemoveStudent(person.id, person.fullName)
              : undefined
          }
          removingId={removeStudent.isPending ? removeStudent.variables?.studentId : undefined}
          removeLabel={t("root.enrollment.assign.remove")}
        />
      </div>

      {isAdmin ? (
        <AssignStudentDialog
          open={assignOpen}
          onOpenChange={setAssignOpen}
          classId={classItem.id}
          students={students}
          enrolledStudentIds={classItem.students.map((person) => person.id)}
          onAssigned={() => router.refresh()}
        />
      ) : null}

      {isAdmin ? (
        <>
          <EditClassDialog
            open={editOpen}
            onOpenChange={setEditOpen}
            classInfo={{
              id: classItem.id,
              name: classItem.name,
              description: classItem.description ?? null,
              pictureUrl: classItem.pictureUrl ?? null,
            }}
          />
          <DeleteClassDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            classId={classItem.id}
            className={classItem.name}
            redirectOnSuccess="/groups"
          />
        </>
      ) : null}
    </section>
  );
}

type PeopleCardProps = {
  title: string;
  emptyLabel: string;
  icon: React.ReactNode;
  people: ApiClassPerson[];
  /** Optional control rendered on the right of the card header (e.g. Add). */
  headerAction?: React.ReactNode;
  /** When provided, each row gets a Remove button that calls this. */
  onRemove?: (person: ApiClassPerson) => void;
  /** `StudentProfile.id` currently being removed, for the row spinner. */
  removingId?: string;
  removeLabel?: string;
};

function PeopleCard({
  title,
  emptyLabel,
  icon,
  people,
  headerAction,
  onRemove,
  removingId,
  removeLabel,
}: PeopleCardProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--foreground)]">
        <span className="text-[var(--muted-foreground)]">{icon}</span>
        {title}
        {headerAction ? <div className="ml-auto">{headerAction}</div> : null}
      </div>
      {people.length === 0 ? (
        <div className="px-5 py-6 text-sm text-[var(--muted-foreground)]">{emptyLabel}</div>
      ) : (
        <ul className="divide-y divide-[var(--border)]">
          {people.map((person) => {
            const isRemoving = removingId === person.id;
            return (
              <li key={person.id} className="flex items-center gap-3 px-5 py-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/10 text-sm font-semibold text-[var(--primary)]">
                  {person.fullName.trim().charAt(0).toUpperCase() || "?"}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-[var(--foreground)]">
                    {person.fullName}
                  </div>
                  {person.email ? (
                    <div className="truncate text-xs text-[var(--muted-foreground)]">
                      {person.email}
                    </div>
                  ) : null}
                </div>
                {onRemove ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="shrink-0 text-[var(--muted-foreground)] hover:text-[var(--destructive)]"
                    disabled={isRemoving}
                    aria-busy={isRemoving}
                    aria-label={`${removeLabel ?? t("root.enrollment.assign.remove")} ${person.fullName}`}
                    onClick={() => onRemove(person)}
                  >
                    {isRemoving ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      removeLabel ?? t("root.enrollment.assign.remove")
                    )}
                  </Button>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

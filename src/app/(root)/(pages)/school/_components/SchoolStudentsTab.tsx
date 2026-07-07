"use client";

import { useTranslation } from "react-i18next";
import { GraduationCap } from "lucide-react";

import { RelativeTime } from "@/components/Custom/RelativeTime";
import type { StudentItem } from "@/app/(root)/_lib/students.schemas";
import Empty from "../../_components/ui/Empty";

type SchoolStudentsTabProps = {
  students: StudentItem[];
};

/**
 * Renders the student roster returned by `GET /students`
 * (see `docs/features/students-page-contract.md`). Rendered only for admins;
 * teacher/student sessions never see this tab so the endpoint isn't called.
 */
export default function SchoolStudentsTab({ students }: SchoolStudentsTabProps) {
  const { t } = useTranslation();

  if (students.length === 0) {
    return (
      <Empty
        title={t("root.schoolPage.students.emptyTitle")}
        description={t("root.schoolPage.students.emptyDescription")}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
      {/* Desktop / tablet: proper table. */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--muted)]/40 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
            <tr>
              <th className="px-4 py-3">{t("root.schoolPage.students.columns.student")}</th>
              <th className="px-4 py-3">{t("root.schoolPage.students.columns.code")}</th>
              <th className="px-4 py-3">{t("root.schoolPage.students.columns.classes")}</th>
              <th className="px-4 py-3">{t("root.schoolPage.students.columns.joined")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {students.map((student) => (
              <StudentRow key={student.memberId} student={student} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards. */}
      <ul className="divide-y divide-[var(--border)] md:hidden">
        {students.map((student) => (
          <StudentCard key={student.memberId} student={student} />
        ))}
      </ul>
    </div>
  );
}

function StudentRow({ student }: { student: StudentItem }) {
  const { t } = useTranslation();
  const classesText = summarizeClasses(student, t);
  const joinedAt = student.joinedAt ?? student.createdAt;

  return (
    <tr className="text-[var(--foreground)]">
      <td className="px-4 py-3 align-top">
        <div className="flex items-center gap-3">
          <Avatar name={student.fullName} />
          <div className="min-w-0">
            <div className="truncate font-medium">{student.fullName}</div>
            <div className="truncate text-xs text-[var(--muted-foreground)]">
              {student.email}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 align-top">
        {student.studentCode ? (
          <span className="inline-flex items-center rounded-md bg-[var(--muted)] px-2 py-0.5 font-mono text-xs text-[var(--foreground)]">
            {student.studentCode}
          </span>
        ) : (
          <span className="text-xs text-[var(--muted-foreground)]">—</span>
        )}
      </td>
      <td className="px-4 py-3 align-top text-[var(--muted-foreground)]">{classesText}</td>
      <td className="px-4 py-3 align-top text-[var(--muted-foreground)]">
        {joinedAt ? <RelativeTime date={joinedAt} /> : "—"}
      </td>
    </tr>
  );
}

function StudentCard({ student }: { student: StudentItem }) {
  const { t } = useTranslation();
  const classesText = summarizeClasses(student, t);
  const joinedAt = student.joinedAt ?? student.createdAt;

  return (
    <li className="flex flex-col gap-2 px-4 py-3">
      <div className="flex items-center gap-3">
        <Avatar name={student.fullName} />
        <div className="min-w-0">
          <div className="truncate font-medium text-[var(--foreground)]">
            {student.fullName}
          </div>
          <div className="truncate text-xs text-[var(--muted-foreground)]">
            {student.email}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--muted-foreground)]">
        {student.studentCode ? (
          <span className="inline-flex items-center rounded-md bg-[var(--muted)] px-2 py-0.5 font-mono text-[11px] text-[var(--foreground)]">
            {student.studentCode}
          </span>
        ) : null}
        <span className="inline-flex items-center gap-1">
          <GraduationCap className="h-3.5 w-3.5" />
          {classesText}
        </span>
        {joinedAt ? <RelativeTime date={joinedAt} /> : null}
      </div>
    </li>
  );
}

function Avatar({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/10 text-sm font-semibold text-[var(--primary)]">
      {initial}
    </span>
  );
}

function summarizeClasses(
  student: StudentItem,
  t: (key: string, options?: Record<string, unknown>) => string,
): string {
  const count = student.classCount ?? student.classes.length;
  if (count === 0) {
    return t("root.schoolPage.students.noClasses");
  }
  const previewNames = student.classes
    .filter((assignment) => assignment.isActive)
    .slice(0, 2)
    .map((assignment) => assignment.name);
  const preview = previewNames.length > 0 ? previewNames.join(", ") : null;
  const label = t("root.schoolPage.students.classCount", { count });
  return preview ? `${label} · ${preview}` : label;
}

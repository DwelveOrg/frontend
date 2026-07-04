"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { containerVariants, itemVariants } from "../../_constants";
import { classAccentById, classFilterLabelKeys, classFilters, mockClasses } from "../_constants";
import type { ClassFilter } from "../_types";
import ClassCard from "./ClassCard";
import ClassesHeader from "./ClassesHeader";

type ClassesViewProps = {
  schoolName: string;
  schoolDescription?: string | null;
  isAdmin: boolean;
  studentJoinCode?: string | null;
};

export default function ClassesView({
  schoolName,
  schoolDescription,
  isAdmin,
  studentJoinCode,
}: ClassesViewProps) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<ClassFilter>("all");

  // Stats are derived from the class data so the header stays consistent with
  // the grid as the mock data (later: the API response) changes.
  const studentCount = useMemo(
    () => mockClasses.reduce((sum, item) => sum + item.studentCount, 0),
    [],
  );
  const teacherCount = useMemo(
    () => new Set(mockClasses.map((item) => item.teacher)).size,
    [],
  );

  const visible = useMemo(
    () => (filter === "all" ? mockClasses : mockClasses.filter((item) => item.status === filter)),
    [filter],
  );

  return (
    <div className="flex flex-col gap-6">
      <ClassesHeader
        name={schoolName}
        description={schoolDescription}
        classCount={mockClasses.length}
        studentCount={studentCount}
        teacherCount={teacherCount}
        isAdmin={isAdmin}
        studentJoinCode={studentJoinCode}
      />

      {/* Underline tabs echo the reference's tab row, adapted to real class status. */}
      <div className="flex flex-wrap items-center gap-1 border-b border-[var(--border)]">
        {classFilters.map((value) => {
          const isActive = filter === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              aria-pressed={isActive}
              className={`relative inline-flex h-9 cursor-pointer items-center px-3 text-sm font-medium transition-colors ${
                isActive
                  ? "text-[var(--primary)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              {t(classFilterLabelKeys[value])}
              {isActive ? (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[var(--primary)]" />
              ) : null}
            </button>
          );
        })}
      </div>

      {visible.length > 0 ? (
        <motion.div
          key={filter}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <ClassCard item={item} accent={classAccentById[item.id]} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] px-6 py-12 text-center">
          <p className="text-sm font-medium text-[var(--foreground)]">{t("root.classes.empty.title")}</p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {t("root.classes.empty.description")}
          </p>
        </div>
      )}
    </div>
  );
}

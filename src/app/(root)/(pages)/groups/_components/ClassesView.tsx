"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { SchoolRole } from "@/app/(authentication)/_types/auth";
import { Button } from "@/components/ui/Button";
import Empty from "../../_components/ui/Empty";
import CreateClassDialog from "../../school/_components/CreateClassDialog";
import { classFilterLabelKeys, classFilters } from "../_constants";
import type { ClassFilter, ClassItem } from "../_types";
import ClassGrid from "./ClassGrid";

type ClassesViewProps = {
  items: ClassItem[];
  role: SchoolRole | null;
};

/** How the count subtitle reads depends on why these classes are visible:
 * admins see the whole directory, teachers see what they lead, students what
 * they're enrolled in. */
function subtitleKeyForRole(role: SchoolRole | null): string {
  if (role === "ADMIN") {
    return "root.classes.subtitleAdmin";
  }
  if (role === "TEACHER") {
    return "root.classes.subtitleTeacher";
  }
  return "root.classes.subtitleStudent";
}

export default function ClassesView({ items, role }: ClassesViewProps) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<ClassFilter>("all");
  const [createOpen, setCreateOpen] = useState(false);

  const isAdmin = role === "ADMIN";

  const visible = useMemo(
    () => (filter === "all" ? items : items.filter((item) => item.status === filter)),
    [filter, items],
  );

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            {t("root.classes.title")}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {items.length > 0
              ? t(subtitleKeyForRole(role), { count: items.length })
              : t("root.classes.subtitleEmpty")}
          </p>
        </div>
        {isAdmin ? (
          <Button size="lg" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            {t("root.schoolPage.actions.createClass")}
          </Button>
        ) : null}
      </header>

      {items.length > 0 ? (
        <>
          {/* Underline tabs filter the list by status. */}
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
            <ClassGrid key={filter} items={visible} isAdmin={isAdmin} />
          ) : (
            <Empty
              title={t("root.classes.empty.title")}
              description={t("root.classes.empty.description")}
            />
          )}
        </>
      ) : (
        <Empty
          title={t("root.classes.noneTitle")}
          description={t("root.classes.noneDescription")}
        />
      )}

      {isAdmin ? (
        <CreateClassDialog open={createOpen} onOpenChange={setCreateOpen} />
      ) : null}
    </div>
  );
}

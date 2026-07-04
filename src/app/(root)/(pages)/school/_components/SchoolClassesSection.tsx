"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import Empty from "../../_components/ui/Empty";
import ClassGrid from "../../groups/_components/ClassGrid";
import type { ClassItem } from "../../groups/_types";
import CreateClassDialog from "./CreateClassDialog";

type SchoolClassesSectionProps = {
  items: ClassItem[];
  isAdmin: boolean;
};

/**
 * Tab row from the reference. Only "Classes" is real today; "Courses" and
 * "Groups" are reserved and rendered as disabled "soon" tabs.
 */
export default function SchoolClassesSection({ items, isAdmin }: SchoolClassesSectionProps) {
  const { t } = useTranslation();
  const [createOpen, setCreateOpen] = useState(false);

  const softTabs = [
    { key: "courses", label: t("root.schoolPage.tabs.courses") },
    { key: "groups", label: t("root.schoolPage.tabs.groups") },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)]">
        <div className="flex flex-wrap items-center gap-1">
          <span className="relative inline-flex h-9 items-center px-3 text-sm font-semibold text-[var(--primary)]">
            {t("root.schoolPage.tabs.classes")}
            <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[var(--primary)]" />
          </span>
          {softTabs.map((tab) => (
            <span
              key={tab.key}
              aria-disabled="true"
              className="inline-flex h-9 cursor-not-allowed items-center gap-1.5 px-3 text-sm font-medium text-[var(--muted-foreground)] opacity-60"
            >
              {tab.label}
              <span className="rounded-full bg-[var(--muted)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide">
                {t("root.schoolPage.soon")}
              </span>
            </span>
          ))}
        </div>

        {isAdmin ? (
          <Button size="lg" className="mb-2" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            {t("root.schoolPage.actions.createClass")}
          </Button>
        ) : null}
      </div>

      {items.length > 0 ? (
        <ClassGrid items={items} />
      ) : (
        <Empty
          title={t("root.schoolPage.directory.emptyTitle")}
          description={
            isAdmin
              ? t("root.schoolPage.directory.emptyAdmin")
              : t("root.schoolPage.directory.emptyMember")
          }
        />
      )}

      {isAdmin ? <CreateClassDialog open={createOpen} onOpenChange={setCreateOpen} /> : null}
    </div>
  );
}

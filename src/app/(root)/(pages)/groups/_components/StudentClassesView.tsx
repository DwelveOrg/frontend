"use client";

import Link from "next/link";
import { Compass } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/Button";
import Empty from "../../_components/ui/Empty";
import type { ClassItem } from "../_types";
import ClassGrid from "./ClassGrid";
import ClassesNav from "./ClassesNav";

type StudentClassesViewProps = {
  items: ClassItem[];
  schoolId: string | undefined;
};

/**
 * The student My Classes surface. Shows only the active roster classes returned
 * by `GET /me/classes?status=ACTIVE` — a student who joined a school is not
 * automatically in every class, so this list is intentionally narrow.
 */
export default function StudentClassesView({ items, schoolId }: StudentClassesViewProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          {t("root.enrollment.myClasses.title")}
        </h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          {items.length > 0
            ? t("root.enrollment.myClasses.subtitle", { count: items.length })
            : t("root.enrollment.myClasses.subtitleEmpty")}
        </p>
      </header>

      <ClassesNav schoolId={schoolId} />

      {items.length > 0 ? (
        <ClassGrid items={items} isAdmin={false} />
      ) : (
        <Empty
          title={t("root.enrollment.myClasses.emptyTitle")}
          description={t("root.enrollment.myClasses.emptyDescription")}
          action={
            <Button asChild className="w-full">
              <Link href="/groups/discover">
                <Compass className="h-4 w-4" />
                {t("root.enrollment.myClasses.browse")}
              </Link>
            </Button>
          }
        />
      )}
    </div>
  );
}

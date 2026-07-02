"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import type { SchoolRole } from "@/app/(authentication)/_types/auth";
import Empty from "../Empty";
import JoinSchoolDialog from "./JoinSchoolDialog";

type RoleEmptyStateProps = {
  role?: SchoolRole | null;
  entity: "class" | "school";
};

export default function RoleEmptyState({ role, entity }: RoleEmptyStateProps) {
  const { t } = useTranslation();

  const canCreate = role === "OWNER" || role === "DIRECTOR" || role === "ADMIN";

  if (entity === "school" && canCreate) {
    return (
      <Empty
        action={
          <Button
            asChild
            size="lg"
            className="h-11 w-full cursor-pointer rounded-xl bg-[var(--primary)] px-5 text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]"
          >
            <Link href="/schools/new">
              {t("root.empty.actions.createSchool")}
            </Link>
          </Button>
        }
      />
    );
  }

  if (entity === "school") {
    return (
      <Empty
        action={
          <JoinSchoolDialog
            trigger={
              <Button
                type="button"
                size="lg"
                className="h-11 w-full cursor-pointer rounded-xl bg-[var(--primary)] px-5 text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]"
              >
                {t("root.empty.actions.joinSchool")}
              </Button>
            }
          />
        }
      />
    );
  }

  const actionKey = canCreate
    ? "root.empty.actions.createClass"
    : "root.empty.actions.joinClass";

  return (
    <Empty
      action={
        <Button
          type="button"
          size="lg"
          disabled
          className="h-11 w-full cursor-pointer rounded-xl bg-[var(--primary)] px-5 text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]"
        >
          {t(actionKey)}
        </Button>
      }
    />
  );
}

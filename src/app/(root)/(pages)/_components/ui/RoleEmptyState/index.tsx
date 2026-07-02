"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import type { WorkspaceRole } from "@/app/(authentication)/_types/auth";
import Empty from "../Empty";

type RoleEmptyStateProps = {
  role?: WorkspaceRole | null;
  entity: "class" | "school";
};

export default function RoleEmptyState({ role, entity }: RoleEmptyStateProps) {
  const { t } = useTranslation();

  const canCreate = role === "OWNER" || role === "DIRECTOR" || role === "ADMIN";

  const actionKey = canCreate
    ? entity === "school"
      ? "root.empty.actions.createSchool"
      : "root.empty.actions.createClass"
    : entity === "school"
      ? "root.empty.actions.joinSchool"
      : "root.empty.actions.joinClass";

  return (
    <Empty
      action={
        <Button
          type="button"
          size="lg"
          className="h-11 w-full cursor-pointer rounded-xl bg-[var(--primary)] px-5 text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]"
        >
          {t(actionKey)}
        </Button>
      }
    />
  );
}

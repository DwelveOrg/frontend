"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { SessionUser } from "@/app/(root)/_utils/getUser";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AccountCard({ user }: { user: SessionUser | null }) {
  const { t } = useTranslation();

  if (!user) return null;

  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3.5 sm:px-5">
      <div className="grid size-11 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-sm font-semibold text-[var(--primary)]">
        {getInitials(user.fullName)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[var(--foreground)]">
          {user.fullName}
        </p>
        <p className="truncate text-[13px] text-[var(--muted-foreground)]">
          {user.email}
        </p>
      </div>
      <Link
        href="/profile"
        className="flex shrink-0 items-center gap-0.5 text-[13px] font-medium text-[var(--primary)] transition-opacity hover:opacity-75"
      >
        {t("root.pages.profile")}
        <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

"use client";

import { Building2, GraduationCap, TicketCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";

const actions = [
  {
    key: "createWorkspace",
    icon: Building2,
  },
  {
    key: "redeemInvite",
    icon: TicketCheck,
  },
  {
    key: "joinStudent",
    icon: GraduationCap,
  },
] as const;

export default function NoMembershipState() {
  const { t } = useTranslation();

  return (
    <section className="flex min-h-[52vh] items-center justify-center">
      <div className="w-full max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
          {t("root.dashboard.empty.eyebrow")}
        </p>
        <h1 className="mt-3 text-2xl font-bold text-[var(--foreground)] md:text-3xl">
          {t("root.dashboard.empty.title")}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">
          {t("root.dashboard.empty.description")}
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {actions.map(({ key, icon: Icon }) => (
            <Button
              key={key}
              type="button"
              variant="outline"
              size="lg"
              disabled
              className="h-auto min-h-24 flex-col gap-2 whitespace-normal rounded-xl px-4 py-4 text-center"
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-semibold">
                {t(`root.dashboard.empty.actions.${key}`)}
              </span>
              <span className="text-xs font-normal text-[var(--muted-foreground)]">
                {t("root.dashboard.empty.actions.comingSoon")}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}

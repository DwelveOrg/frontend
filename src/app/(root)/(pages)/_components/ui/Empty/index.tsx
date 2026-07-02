"use client";

import React, { type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import EmptyArtwork from "./Artwork";

type EmptyProps = {
  title?: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
  action?: ReactNode;
};

const Empty = ({ title, description, icon, className = "", action }: EmptyProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-lg flex-col items-center rounded-2xl border border-[var(--border)] bg-[var(--card)] px-6 py-10 text-center",
        className
      )}
    >
      <div className="relative">{icon ?? <EmptyArtwork />}</div>

      <h2 className="mt-5 text-xl font-semibold tracking-tight text-[var(--foreground)]">
        {title ?? t("root.empty.title")}
      </h2>
      <p className="mt-2 max-w-xs text-sm leading-6 text-[var(--muted-foreground)]">
        {description ?? t("root.empty.description")}
      </p>
      {action ? <div className="mt-6 w-full max-w-[220px]">{action}</div> : null}
    </div>
  );
};

export default Empty;

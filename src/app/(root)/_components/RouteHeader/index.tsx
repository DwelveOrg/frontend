"use client";

import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

import { getRouteLabelKey } from "../../_constants";
import PageHeader from "../PageHeader";

export default function RouteHeader() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const segments = pathname.split("/").filter(Boolean);
  const last = segments[segments.length - 1];
  const key = last ? getRouteLabelKey(last) : undefined;
  const title = key ? t(key) : last ? last.replace(/-/g, " ") : t("root.pages.dashboard");

  return <PageHeader title={title} />;
}

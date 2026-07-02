"use client";

import { useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { supportedLanguages, type AppLanguage } from "@/i18n/resources";
import { Segmented, type SegmentedOption } from "./Segmented";

export function LanguageSegment() {
  const { i18n, t } = useTranslation();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const current = (i18n.resolvedLanguage ?? i18n.language ?? "en") as AppLanguage;
  const value = supportedLanguages.includes(current) ? current : "en";

  const options: SegmentedOption<AppLanguage>[] = supportedLanguages.map((language) => ({
    value: language,
    label: language.toUpperCase(),
  }));

  const handleChange = (next: AppLanguage) => {
    if (!supportedLanguages.includes(next)) return;
    window.localStorage.setItem("gf-language", next);
    void i18n.changeLanguage(next);
  };

  if (!mounted) {
    return <div className="h-11 rounded-xl border border-[var(--border)] bg-[var(--muted)]" />;
  }

  return (
    <Segmented
      layoutId="settings-language"
      ariaLabel={t("language.label")}
      value={value}
      onChange={handleChange}
      options={options}
    />
  );
}

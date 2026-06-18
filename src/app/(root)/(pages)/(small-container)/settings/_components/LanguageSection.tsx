"use client";

import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { SectionCard } from "../../../_components/layout/SectionCard";
import { switcherClassNames } from "../_constants";

export function LanguageSection() {
  const { t } = useTranslation();

  return (
    <SectionCard icon={Languages} title={t("root.settings.language.title")} description="">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {t("root.settings.language.primary.title")}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
            {t("root.settings.language.primary.description")}
          </p>
        </div>
        <LanguageSwitcher
          compact
          triggerClassName={switcherClassNames.trigger}
          contentClassName={switcherClassNames.content}
          itemClassName={switcherClassNames.item}
        />
      </div>
    </SectionCard>
  );
}

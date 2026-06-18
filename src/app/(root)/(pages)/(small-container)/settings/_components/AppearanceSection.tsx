"use client";

import { Palette } from "lucide-react";
import { useTranslation } from "react-i18next";
import ThemeSwitchAlternative from "@/components/ThemeSwitch.alternative";
import { SectionCard } from "../../../_components/layout/SectionCard";
import { switcherClassNames } from "../_constants";

export function AppearanceSection() {
  const { t } = useTranslation();

  return (
    <SectionCard icon={Palette} title={t("root.settings.appearance.title")} description="">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {t("root.settings.appearance.themeLabel")}
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
              {t("root.settings.appearance.themeHelp")}
            </p>
          </div>
          <ThemeSwitchAlternative
            compact
            triggerClassName={switcherClassNames.trigger}
            contentClassName={switcherClassNames.content}
            itemClassName={switcherClassNames.item}
          />
        </div>
      </div>
    </SectionCard>
  );
}

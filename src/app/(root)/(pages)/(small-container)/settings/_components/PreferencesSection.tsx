"use client";

import { Languages, Palette } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SettingsGroup } from "./SettingsGroup";
import { SettingsRow } from "./SettingsRow";
import { ThemeSegment } from "./ThemeSegment";
import { LanguageSegment } from "./LanguageSegment";

export function PreferencesSection() {
  const { t } = useTranslation();

  return (
    <SettingsGroup label={t("root.settings.groups.preferences")}>
      <SettingsRow
        icon={Palette}
        title={t("root.settings.appearance.themeLabel")}
        description={t("root.settings.appearance.themeHelp")}
        control={<ThemeSegment />}
      />
      <SettingsRow
        icon={Languages}
        title={t("root.settings.language.primary.title")}
        description={t("root.settings.language.primary.description")}
        control={<LanguageSegment />}
      />
    </SettingsGroup>
  );
}

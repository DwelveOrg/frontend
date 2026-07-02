import { formatDistanceToNow, type Locale } from "date-fns";
import { enUS, ru, uz } from "date-fns/locale";

/**
 * Maps our i18n language codes (see CLAUDE.md: en / ru / uz) to date-fns
 * locales so relative times read naturally in the active UI language.
 */
const localeByLanguage: Record<string, Locale> = {
  en: enUS,
  ru,
  uz,
};

function resolveLocale(language: string | undefined): Locale {
  if (!language) return enUS;
  const base = language.toLowerCase().split("-")[0];
  return localeByLanguage[base] ?? enUS;
}

/**
 * Live, localized "x ago" string for a timestamp — e.g. "2 hours ago",
 * "2 часа назад", "2 soat oldin". Replaces the frozen, hand-translated
 * timestamp strings that used to live in the message catalogs.
 */
export function formatRelativeTime(
  input: Date | string | number,
  language: string | undefined,
): string {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return "";
  return formatDistanceToNow(date, { addSuffix: true, locale: resolveLocale(language) });
}

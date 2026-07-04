import type { ClassFilter } from "../_types";

export const classFilters: ClassFilter[] = ["all", "active", "archived"];

export const classFilterLabelKeys: Record<ClassFilter, string> = {
  all: "root.classes.filters.all",
  active: "root.classes.filters.active",
  archived: "root.classes.filters.archived",
};

/**
 * Decorative avatar tints — purely visual variety, like an avatar colour set,
 * not semantic tokens. Assigned per class by a stable index so each class keeps
 * the same colour across filters.
 */
export const classAccents = [
  "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300",
  "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
  "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
  "bg-pink-100 text-pink-600 dark:bg-pink-500/15 dark:text-pink-300",
  "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300",
  "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300",
] as const;

/**
 * Deterministic accent for a class from its id, so a class keeps the same colour
 * across filters and page loads (the real ids are opaque, so we hash them into
 * the palette rather than relying on array position).
 */
export function classAccent(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return classAccents[hash % classAccents.length];
}

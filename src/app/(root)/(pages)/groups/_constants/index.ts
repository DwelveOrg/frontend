import type { ClassFilter, ClassItem } from "../_types";

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
 * Placeholder classes. Standing in for `GET /classes` until that endpoint
 * exists — shaped like the eventual API response so the view swaps cleanly.
 * Mirrors the existing mock pattern (DashboardStats, examItems).
 */
export const mockClasses: ClassItem[] = [
  { id: "cls-math", name: "Mathematics", course: "Algebra II", teacher: "Mr. Robert Chen", studentCount: 32, status: "active" },
  { id: "cls-phys", name: "Physics", course: "Mechanics", teacher: "Dr. Emily Park", studentCount: 28, status: "active" },
  { id: "cls-bio", name: "Biology", course: "Molecular Bio", teacher: "Ms. Lisa Wong", studentCount: 35, status: "active" },
  { id: "cls-eng", name: "English Lit", course: "American Novel", teacher: "Mrs. Jane Foster", studentCount: 24, status: "active" },
  { id: "cls-hist", name: "History", course: "World History", teacher: "Mr. David Kim", studentCount: 30, status: "active" },
  { id: "cls-chem", name: "Chemistry", course: "Organic Chem", teacher: "Dr. Alan Rivera", studentCount: 27, status: "active" },
  { id: "cls-art", name: "Visual Arts", course: "Studio I", teacher: "Ms. Nadia Petrov", studentCount: 19, status: "archived" },
  { id: "cls-cs", name: "Computer Science", course: "Intro to CS", teacher: "Mr. Omar Haddad", studentCount: 41, status: "archived" },
];

/** Stable class-id → accent map so colours don't reshuffle when filtering. */
export const classAccentById: Record<string, string> = Object.fromEntries(
  mockClasses.map((item, index) => [item.id, classAccents[index % classAccents.length]]),
);

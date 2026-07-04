import type { TFunction } from "i18next";
import type {
  NotificationCategory,
  NotificationInvitationData,
  NotificationItem,
} from "@/app/(root)/_types";

const INVITATION_TYPES = /invit|join[_-]?request/i;
const PAYMENT_TYPES = /payment|billing|fee|invoice|subscription/i;

/**
 * Derives the category tab a notification belongs to from its `type`. Runs on
 * the client over the `all` result set; the backend is expected to eventually
 * accept a `category` query param (see docs/features/notifications.md).
 */
export function getNotificationCategory(type: string): NotificationCategory {
  if (INVITATION_TYPES.test(type)) return "invitations";
  if (PAYMENT_TYPES.test(type)) return "payments";
  return "system";
}

/** Icon container tint per category, driven by design tokens (never hard-coded hex). */
export const CATEGORY_TINT: Record<NotificationCategory, string> = {
  system: "bg-[color-mix(in_srgb,var(--info)_14%,transparent)] text-[var(--info)]",
  payments: "bg-[color-mix(in_srgb,var(--success)_16%,transparent)] text-[var(--success)]",
  invitations: "bg-[color-mix(in_srgb,var(--primary)_16%,transparent)] text-[var(--primary)]",
};

/** True when a notification is an unresolved invitation (renders Accept / Decline). */
export function isPendingInvitation(item: NotificationItem): boolean {
  if (getNotificationCategory(item.type) !== "invitations") return false;
  const status = (item.data as NotificationInvitationData | null | undefined)?.status;
  return status !== "accepted" && status !== "declined";
}

export type NotificationGroup = {
  key: string;
  label: string;
  items: NotificationItem[];
};

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/**
 * Buckets notifications into Today / Yesterday / Earlier this week / older
 * per-day sections, comparing by local calendar day and preserving the
 * backend's newest-first ordering.
 */
export function groupNotificationsByDate(
  items: NotificationItem[],
  t: TFunction,
  language: string,
): NotificationGroup[] {
  const todayStart = startOfDay(new Date());
  const dayMs = 24 * 60 * 60 * 1000;
  const fullDate = new Intl.DateTimeFormat(language, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const order: string[] = [];
  const groups = new Map<string, NotificationGroup>();

  for (const item of items) {
    const created = new Date(item.createdAt);
    const diffDays = Math.round((todayStart - startOfDay(created)) / dayMs);

    let key: string;
    let label: string;
    if (diffDays <= 0) {
      key = "today";
      label = t("root.notifications.dateGroups.today");
    } else if (diffDays === 1) {
      key = "yesterday";
      label = t("root.notifications.dateGroups.yesterday");
    } else if (diffDays < 7) {
      key = "week";
      label = t("root.notifications.dateGroups.earlierThisWeek");
    } else {
      key = `older-${startOfDay(created)}`;
      label = fullDate.format(created);
    }

    if (!groups.has(key)) {
      groups.set(key, { key, label, items: [] });
      order.push(key);
    }

    groups.get(key)?.items.push(item);
  }

  return order.map((key) => groups.get(key)!);
}

import { LucideIcon } from "lucide-react";

export interface NotificationItem {
  id: string;
  schoolId?: string | null;
  type: string;
  titleKey: string;
  bodyKey: string;
  /** Optional backend payload; for invitations it carries {@link NotificationInvitationData}. */
  data?: NotificationInvitationData | Record<string, unknown> | null;
  /** ISO 8601 timestamp; rendered as a live relative time via <RelativeTime />. */
  createdAt: string;
  readAt?: string | null;
  unread: boolean;
}

/**
 * Structured payload on invitation-type notifications, used to render the
 * inline Accept / Decline actions and to resolve the invite on the backend.
 * See docs/features/notifications.md.
 */
export type NotificationInvitationData = {
  invitationId?: string;
  /** Resolution state once the user has responded (backend-owned). */
  status?: "pending" | "accepted" | "declined";
  [key: string]: unknown;
};

/** Read-state filter sent to the backend as the `tab` query param. */
export type NotificationTab = "all" | "unread";

/** Client-side category derived from a notification's `type`. */
export type NotificationCategory = "system" | "payments" | "invitations";

/**
 * The active filter pill on the notifications page. `all`/`unread` are backed by
 * the `tab` query param; the category filters run client-side over the `all`
 * result set (see docs/features/notifications.md for the intended
 * server-side `category` param).
 */
export type NotificationFilter = NotificationTab | NotificationCategory;

/** Response body for the "respond to invitation" action. */
export type InvitationResponse = "accept" | "decline";

export type NotificationStatusResponse = {
  hasUnread: boolean;
  unreadCount: number;
};

export type NotificationsListResponse = {
  data: NotificationItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
    unreadCount: number;
  };
};

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export type Items = {
  item: string;
  number: number;
}

export type ThemeOption = "light" | "dark" | "system";

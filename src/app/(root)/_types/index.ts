import { LucideIcon } from "lucide-react";

export interface NotificationItem {
  id: string;
  schoolId?: string | null;
  type: string;
  titleKey: string;
  bodyKey: string;
  /** ISO 8601 timestamp; rendered as a live relative time via <RelativeTime />. */
  createdAt: string;
  readAt?: string | null;
  unread: boolean;
}

export type NotificationTab = "all" | "unread";

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

import { LucideIcon } from "lucide-react";

export interface NotificationItem {
  id: number;
  title: string;
  description: string;
  /** ISO 8601 timestamp; rendered as a live relative time via <RelativeTime />. */
  timestamp: string;
  unread: boolean;
}

export type notificationItemsInterface = NotificationItem;

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

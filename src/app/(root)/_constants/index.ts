import type { NotificationItem } from "../_types";

export { getRouteLabelKey, isRouteActive, ROUTE_LABEL_KEYS } from "./routes";

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

export const notificationItems: NotificationItem[] = [
  {
    id: 1,
    title: "root.notifications.items.newMessage.title",
    description: "root.notifications.items.newMessage.description",
    timestamp: minutesAgo(120),
    unread: true,
  },
  {
    id: 2,
    title: "root.notifications.items.serverAlert.title",
    description: "root.notifications.items.serverAlert.description",
    timestamp: minutesAgo(60),
    unread: false,
  },
  {
    id: 3,
    title: "root.notifications.items.policyUpdate.title",
    description: "root.notifications.items.policyUpdate.description",
    timestamp: minutesAgo(65),
    unread: true,
  },
];

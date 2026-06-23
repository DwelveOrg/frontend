import type { NotificationItem } from "../_types";

export { getRouteLabelKey, isRouteActive, ROUTE_LABEL_KEYS } from "./routes";

export const notificationItems: NotificationItem[] = [
  {
    id: 1,
    title: "root.notifications.items.newMessage.title",
    description: "root.notifications.items.newMessage.description",
    timestamp: "root.notifications.items.newMessage.timestamp",
    unread: true,
  },
  {
    id: 2,
    title: "root.notifications.items.serverAlert.title",
    description: "root.notifications.items.serverAlert.description",
    timestamp: "root.notifications.items.serverAlert.timestamp",
    unread: false,
  },
  {
    id: 3,
    title: "root.notifications.items.policyUpdate.title",
    description: "root.notifications.items.policyUpdate.description",
    timestamp: "root.notifications.items.policyUpdate.timestamp",
    unread: true,
  },
];

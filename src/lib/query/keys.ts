export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },
  dashboard: {
    all: ["dashboard"] as const,
  },
  schools: {
    all: ["schools"] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    status: () => [...queryKeys.notifications.all, "status"] as const,
    list: (tab: "all" | "unread", limit: number) =>
      [...queryKeys.notifications.all, "list", tab, limit] as const,
  },
};

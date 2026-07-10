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
  classes: {
    all: ["classes"] as const,
    detail: (classId: string) => [...queryKeys.classes.all, "detail", classId] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    status: () => [...queryKeys.notifications.all, "status"] as const,
    list: (tab: "all" | "unread", limit: number) =>
      [...queryKeys.notifications.all, "list", tab, limit] as const,
  },
  enrollment: {
    all: ["enrollment"] as const,
    overview: (schoolId: string) =>
      [...queryKeys.enrollment.all, "overview", schoolId] as const,
    /** All discovery variants for a school (used for broad invalidation). */
    discoverAll: (schoolId: string) =>
      [...queryKeys.enrollment.all, "discover", schoolId] as const,
    discover: (schoolId: string, filters: { search: string; limit: number }) =>
      [...queryKeys.enrollment.discoverAll(schoolId), filters] as const,
    myClasses: () => [...queryKeys.enrollment.all, "my-classes"] as const,
    myRequestsAll: () => [...queryKeys.enrollment.all, "my-requests"] as const,
    myRequests: (limit: number) =>
      [...queryKeys.enrollment.myRequestsAll(), limit] as const,
    /** All join-request variants for a class (used for broad invalidation). */
    classRequestsAll: (classId: string) =>
      [...queryKeys.enrollment.all, "class-requests", classId] as const,
    classRequests: (classId: string, filters: { search: string; limit: number }) =>
      [...queryKeys.enrollment.classRequestsAll(classId), filters] as const,
  },
};

export const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/settings",
  "/notifications",
  "/groups",
  "/school",
  "/schools",
  "/assignments",
] as const;

export const publicRoutes = ["/login", "/signup", "/password-reset", "/reset-password"] as const;

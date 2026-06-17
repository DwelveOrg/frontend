export const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/settings",
  "/notifications",
  "/groups",
  "/school",
  "/assignments",
] as const;

export const publicRoutes = ["/login", "/signup", "/password-reset"] as const;

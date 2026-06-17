export type UserRole = "student" | "teacher" | "admin";

export type AuthUser = {
  id: string;
  identifier: string;
  name: string;
  role: UserRole;
};

export type DemoUser = AuthUser & {
  password: string;
};

export type SessionPayload = {
  userId: string;
  expiresAt: string;
  name?: string;
  role?: UserRole;
  identifier?: string;
};

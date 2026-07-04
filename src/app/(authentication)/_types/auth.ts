export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  schoolId?: string;
  memberId?: string;
  schoolRole?: SchoolRole;
  membershipCount: number;
};

export type SchoolRole = "ADMIN" | "TEACHER" | "STUDENT";

export type SessionPayload = {
  userId: string;
  expiresAt: string;
  email: string;
  fullName: string;
  accessToken: string;
  refreshToken?: string;
  schoolId?: string;
  memberId?: string;
  schoolRole?: SchoolRole;
  membershipCount?: number;
};

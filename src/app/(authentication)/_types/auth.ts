export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  workspaceId?: string;
  memberId?: string;
  workspaceRole?: WorkspaceRole;
  membershipCount: number;
};

export type WorkspaceRole = "OWNER" | "DIRECTOR" | "ADMIN" | "TEACHER" | "STUDENT";

export type SessionPayload = {
  userId: string;
  expiresAt: string;
  email: string;
  fullName: string;
  accessToken: string;
  refreshToken?: string;
  workspaceId?: string;
  memberId?: string;
  workspaceRole?: WorkspaceRole;
  membershipCount?: number;
};

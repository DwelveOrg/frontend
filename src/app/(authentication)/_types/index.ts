import type { ReactNode } from "react";

import type { CenterSize, CenterType } from "./_schemas";

export type SessionPayload = {
  userId: string;
  expiresAt: Date;
  /** Set for self-service signups that are not in `testUsers`. */
  name?: string;
  role?: string;
  identifier?: string;
};

export type AuthLayoutProps = Readonly<{
  children: ReactNode;
}>;

export type LoginPageClientProps = {
  logout?: string;
};

export interface CenterTypeOption {
  value: CenterType;
  labelKey: string;
}

export interface CenterSizeOption {
  value: CenterSize;
  labelKey: string;
}

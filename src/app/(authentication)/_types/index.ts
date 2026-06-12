import type { ReactNode } from "react";

import type { SignupFormField } from "./_schemas";

export type SessionPayload = {
  userId: string;
  expiresAt: Date;
};

export type AuthLayoutProps = Readonly<{
  children: ReactNode;
}>;

export type LoginPageClientProps = {
  logout?: string;
};

export interface AuthRoleOption {
  value: SignupFormField["role"];
  labelKey: string;
}

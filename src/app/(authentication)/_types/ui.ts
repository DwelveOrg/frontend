import type { ReactNode } from "react";

export type AuthLayoutProps = Readonly<{
  children: ReactNode;
}>;

export type LoginPageClientProps = {
  logout?: string;
};

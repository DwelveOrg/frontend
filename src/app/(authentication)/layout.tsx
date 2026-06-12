import type { AuthLayoutProps } from "./_types";

const Layout = ({ children }: AuthLayoutProps) => {
  return <div className="app-shell-bg flex min-h-screen w-full flex-col items-center justify-center">{children}</div>;
};

export default Layout;

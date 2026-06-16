import type { AuthLayoutProps } from "./_types";

const Layout = ({ children }: AuthLayoutProps) => {
  return <div className="min-h-screen w-full">{children}</div>;
};

export default Layout;

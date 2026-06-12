const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="landing-shell-bg font-sans flex min-h-screen w-full flex-col items-center justify-center px-4 py-10 text-[#64748b]">
      {children}
    </div>
  );
};

export default Layout;

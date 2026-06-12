import React from "react";
import Image from "next/image";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans">
      {/* Full-bleed cinematic backdrop */}
      <Image
        src="/images/auth/learning.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0b0f1a] via-[#1a1a2e]/85 to-[#4F46E5]/45" />
      <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_120%,rgba(11,15,26,0.9),transparent)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        {children}
      </div>
    </div>
  );
};

export default Layout;

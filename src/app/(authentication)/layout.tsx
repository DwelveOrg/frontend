"use client";

import React from "react";
import { motion, useReducedMotion, type Transition } from "motion/react";

const drift: Transition = { duration: 16, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" };

const Layout = ({ children }: { children: React.ReactNode }) => {
  const reduce = useReducedMotion();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#070a16] font-sans">
      {/* Animated aurora */}
      <motion.div
        className="pointer-events-none absolute -left-32 -top-32 h-[36rem] w-[36rem] rounded-full bg-indigo-600/30 blur-[120px]"
        animate={reduce ? undefined : { x: [0, 80, 0], y: [0, 40, 0] }}
        transition={reduce ? undefined : drift}
      />
      <motion.div
        className="pointer-events-none absolute -right-24 top-10 h-[32rem] w-[32rem] rounded-full bg-cyan-500/20 blur-[120px]"
        animate={reduce ? undefined : { x: [0, -60, 0], y: [0, 60, 0] }}
        transition={reduce ? undefined : drift}
      />
      <motion.div
        className="pointer-events-none absolute bottom-[-10rem] left-1/3 h-[34rem] w-[34rem] rounded-full bg-fuchsia-600/20 blur-[130px]"
        animate={reduce ? undefined : { x: [0, 50, 0], y: [0, -40, 0] }}
        transition={reduce ? undefined : drift}
      />
      {/* fine grid sheen */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        {children}
      </div>
    </div>
  );
};

export default Layout;

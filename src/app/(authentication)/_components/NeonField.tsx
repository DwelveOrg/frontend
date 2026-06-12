"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type NeonFieldProps = React.ComponentPropsWithoutRef<"input"> & {
  label: string;
  error?: string;
  trailing?: React.ReactNode;
};

/** Dark glass field with a neon focus glow. */
const NeonField = React.forwardRef<HTMLInputElement, NeonFieldProps>(
  ({ label, error, trailing, className, id, name, ...props }, ref) => {
    const inputId = id ?? name;

    return (
      <div>
        <label htmlFor={inputId} className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            name={name}
            className={cn(
              "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-indigo-400/80 focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_rgba(99,102,241,0.16),0_0_24px_rgba(99,102,241,0.28)]",
              trailing && "pr-12",
              error && "border-rose-400/70 focus:border-rose-400 focus:shadow-[0_0_0_4px_rgba(244,63,94,0.16)]",
              className
            )}
            {...props}
          />
          {trailing && <div className="absolute inset-y-0 right-2 flex items-center">{trailing}</div>}
        </div>
        {error && <p className="mt-1.5 text-xs text-rose-300">{error}</p>}
      </div>
    );
  }
);

NeonField.displayName = "NeonField";

export default NeonField;

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type PillFieldProps = React.ComponentPropsWithoutRef<"input"> & {
  label: string;
  error?: string;
  trailing?: React.ReactNode;
};

/** Ultra-minimal pill field — centered, translucent, for the immersive art variant. */
const PillField = React.forwardRef<HTMLInputElement, PillFieldProps>(
  ({ label, error, trailing, className, id, name, ...props }, ref) => {
    const inputId = id ?? name;

    return (
      <div>
        <label htmlFor={inputId} className="mb-2 block text-center text-[10px] font-medium uppercase tracking-[0.22em] text-white/50">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            name={name}
            className={cn(
              "w-full rounded-full border border-white/15 bg-white/10 px-5 py-3.5 text-center text-sm text-white outline-none backdrop-blur-md transition-all placeholder:text-white/40 focus:border-white/50 focus:bg-white/[0.18]",
              trailing && "pr-12",
              error && "border-rose-300/70 focus:border-rose-300",
              className
            )}
            {...props}
          />
          {trailing && <div className="absolute inset-y-0 right-2.5 flex items-center">{trailing}</div>}
        </div>
        {error && <p className="mt-1.5 text-center text-xs text-rose-200">{error}</p>}
      </div>
    );
  }
);

PillField.displayName = "PillField";

export default PillField;

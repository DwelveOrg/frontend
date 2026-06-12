"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type UnderlineFieldProps = React.ComponentPropsWithoutRef<"input"> & {
  label: string;
  error?: string;
  trailing?: React.ReactNode;
};

/** Editorial underline input — label above, single bottom rule, ink text. */
const UnderlineField = React.forwardRef<HTMLInputElement, UnderlineFieldProps>(
  ({ label, error, trailing, className, id, name, ...props }, ref) => {
    const inputId = id ?? name;

    return (
      <div>
        <label
          htmlFor={inputId}
          className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94a3b8]"
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            name={name}
            className={cn(
              "w-full border-0 border-b-2 border-slate-200 bg-transparent py-2.5 text-[15px] text-[#1a1a2e] outline-none transition-colors placeholder:text-slate-300 focus:border-[#4F46E5]",
              trailing && "pr-10",
              error && "border-rose-400 focus:border-rose-400",
              className
            )}
            {...props}
          />
          {trailing && <div className="absolute inset-y-0 right-0 flex items-center">{trailing}</div>}
        </div>
        {error && <p className="mt-1.5 text-xs text-rose-500">{error}</p>}
      </div>
    );
  }
);

UnderlineField.displayName = "UnderlineField";

export default UnderlineField;

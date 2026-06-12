"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type GlassFieldProps = React.ComponentPropsWithoutRef<"input"> & {
  label: string;
  error?: string;
  trailing?: React.ReactNode;
};

/**
 * Frosted-glass text field with a floating label. Bespoke to the
 * "cinematic" auth variant — designed to sit on top of full-bleed imagery.
 */
const GlassField = React.forwardRef<HTMLInputElement, GlassFieldProps>(
  ({ label, error, trailing, className, id, name, ...props }, ref) => {
    const inputId = id ?? name;

    return (
      <div>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            name={name}
            placeholder=" "
            className={cn(
              "peer h-14 w-full rounded-2xl border border-white/20 bg-white/10 px-4 pb-1 pt-6 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] outline-none backdrop-blur-md transition-all duration-200 placeholder:text-transparent focus:border-white/60 focus:bg-white/[0.16] focus:ring-4 focus:ring-white/10",
              trailing && "pr-12",
              error && "border-rose-300/70 focus:border-rose-300 focus:ring-rose-400/15",
              className
            )}
            {...props}
          />
          <label
            htmlFor={inputId}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/55 transition-all duration-200 peer-focus:top-3.5 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:font-medium peer-focus:uppercase peer-focus:tracking-[0.12em] peer-focus:text-white/75 peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-medium peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.12em] peer-[:not(:placeholder-shown)]:text-white/75"
          >
            {label}
          </label>
          {trailing && <div className="absolute inset-y-0 right-2 flex items-center">{trailing}</div>}
        </div>
        {error && <p className="mt-1.5 text-xs text-rose-200">{error}</p>}
      </div>
    );
  }
);

GlassField.displayName = "GlassField";

export default GlassField;

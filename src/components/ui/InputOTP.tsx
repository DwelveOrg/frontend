"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"

import { MinusIcon } from "lucide-react"
import { cn } from "@/lib/utils"

function InputOTP({
  className,
  containerClassName,
  value,
  defaultValue,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  const valueProps =
    value !== undefined ? { value } : { defaultValue }

  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex items-center justify-center has-disabled:opacity-50",
        containerClassName
      )}
      spellCheck={false}
      className={cn(
        "disabled:cursor-not-allowed",
        className
      )}
      {...valueProps}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-base font-semibold text-[#1a1a2e] outline-none transition-all first:ml-0 data-[active=true]:z-10 data-[active=true]:border-[#4F46E5] data-[active=true]:bg-[#4F46E5] data-[active=true]:text-white data-[active=true]:ring-2 data-[active=true]:ring-[#4F46E5]/25 aria-invalid:border-red-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:aria-invalid:border-red-400 max-[350px]:h-10 max-[350px]:w-10",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-white duration-1000" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      className="flex items-center text-slate-500 dark:text-slate-300 [&_svg:not([class*='size-'])]:size-4"
      role="separator"
      {...props}
    >
      <MinusIcon
      />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }

"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Check } from "lucide-react";
import { SignupFormField, signupSchema } from "@/app/(authentication)/_types/_schemas/index";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import UnderlineField from "../../_components/UnderlineField";
import EditorialOtp from "../../_components/EditorialOtp";
import {
  defaultSignupValues,
  demoVerificationCode,
  signupStepCount,
  signupStepFields,
} from "../../_constants";

const roleOptions = [
  { value: "student", labelKey: "auth.signup.student" },
  { value: "teacher", labelKey: "auth.signup.teacher" },
] as const;

export default function SignupPage() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormField>({
    resolver: zodResolver(signupSchema),
    defaultValues: defaultSignupValues,
  });

  const role = useWatch({ control, name: "role" });
  const email = useWatch({ control, name: "email" });
  const progress = ((step + 1) / signupStepCount) * 100;

  const nextStep = async () => {
    const valid = await trigger(signupStepFields[step], { shouldFocus: true });
    if (!valid) return;
    if (step === 1) {
      const code = getValues("verificationCode")?.trim();
      if (code !== demoVerificationCode) {
        setError("verificationCode", { message: t("auth.signup.verificationIncorrect") });
        return;
      }
      clearErrors("verificationCode");
      setValue("verificationCode", "");
    }
    setStep((prev) => Math.min(prev + 1, 2));
  };

  const prevStep = () => {
    setValue("verificationCode", "");
    clearErrors("verificationCode");
    setStep((prev) => (prev === 2 ? 0 : Math.max(prev - 1, 0)));
  };

  const onSubmit: SubmitHandler<SignupFormField> = async () => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    setError("root", { message: t("auth.signup.backendMissing") });
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl leading-none text-[#1a1a2e] lg:hidden">
          Dwelve
        </Link>
        <Link
          href="/"
          aria-label={t("auth.common.backToLanding")}
          className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#94a3b8] transition hover:text-[#1a1a2e]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("auth.common.backToLanding")}
        </Link>
      </div>

      {/* Big serif numbered stepper */}
      <div className="mt-10 flex items-center gap-3">
        {[0, 1, 2].map((i) => (
          <React.Fragment key={i}>
            <span
              className={`font-serif text-[28px] leading-none transition-colors ${
                i <= step ? "text-[#1a1a2e]" : "text-slate-300"
              }`}
            >
              {i < step ? <Check className="h-6 w-6 text-[#4F46E5]" /> : `0${i + 1}`}
            </span>
            {i < 2 && (
              <span className={`h-px flex-1 transition-colors ${i < step ? "bg-[#1a1a2e]" : "bg-slate-200"}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <h1 className="mt-7 text-[34px] font-bold leading-[1.05] tracking-tight text-[#1a1a2e]">
        {t("auth.signup.title")}
      </h1>
      <p className="mt-2 text-[15px] text-[#64748b]">
        {t("auth.signup.step", { current: step + 1, total: 3 })} · {Math.round(progress)}%
      </p>

      <form className="mt-9" onSubmit={handleSubmit(onSubmit)} noValidate>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-7"
          >
            {step === 0 && (
              <>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">
                    {t("auth.signup.student")} / {t("auth.signup.teacher")}
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    {roleOptions.map(({ value, labelKey }) => {
                      const active = role === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setValue("role", value, { shouldValidate: true })}
                          className={`rounded-lg border px-4 py-3 text-sm font-semibold uppercase tracking-[0.08em] transition ${
                            active
                              ? "border-[#1a1a2e] bg-[#1a1a2e] text-white"
                              : "border-slate-300 text-[#64748b] hover:border-[#1a1a2e] hover:text-[#1a1a2e]"
                          }`}
                        >
                          {t(labelKey)}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <UnderlineField {...register("fullName")} type="text" label={t("auth.signup.fullName")} placeholder={t("auth.signup.fullNamePlaceholder")} error={errors.fullName?.message} />
                <UnderlineField {...register("email")} type="email" label={t("auth.signup.email")} placeholder={t("auth.signup.emailPlaceholder")} error={errors.email?.message} />
              </>
            )}

            {step === 1 && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">
                  {t("auth.signup.verificationLabel")}
                </p>
                <p className="mb-5 mt-2 text-sm text-[#64748b]">
                  {t("auth.signup.verificationHelp", { email: email || t("auth.signup.yourEmail") })}{" "}
                  {t("auth.signup.demoCode")}: <span className="font-semibold text-[#4F46E5]">{demoVerificationCode}</span>
                </p>
                <Controller
                  control={control}
                  name="verificationCode"
                  render={({ field }) => (
                    <EditorialOtp
                      value={field.value ?? ""}
                      autoFocus
                      invalid={!!errors.verificationCode}
                      onChange={(value) => {
                        field.onChange(value);
                        if (errors.verificationCode) clearErrors("verificationCode");
                      }}
                    />
                  )}
                />
                {errors.verificationCode && <p className="mt-3 text-xs text-rose-500">{errors.verificationCode.message}</p>}
              </div>
            )}

            {step === 2 && (
              <>
                <UnderlineField {...register("username")} type="text" label={t("auth.signup.username")} placeholder={t("auth.signup.usernamePlaceholder")} error={errors.username?.message} />
                <UnderlineField
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  label={t("auth.signup.password")}
                  placeholder={t("auth.signup.createPasswordPlaceholder")}
                  error={errors.password?.message}
                  trailing={
                    <button type="button" onClick={() => setShowPassword((p) => !p)} className="inline-flex h-9 w-9 items-center justify-center text-[#94a3b8] transition hover:text-[#1a1a2e]" aria-label={showPassword ? t("auth.signup.hidePassword") : t("auth.signup.showPassword")}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                />
                <UnderlineField
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  label={t("auth.signup.confirmPassword")}
                  placeholder={t("auth.signup.confirmPasswordPlaceholder")}
                  error={errors.confirmPassword?.message}
                  trailing={
                    <button type="button" onClick={() => setShowConfirmPassword((p) => !p)} className="inline-flex h-9 w-9 items-center justify-center text-[#94a3b8] transition hover:text-[#1a1a2e]" aria-label={showConfirmPassword ? t("auth.signup.hideConfirmPassword") : t("auth.signup.showConfirmPassword")}>
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                />
                <label className="flex cursor-pointer items-start gap-3 border-t border-slate-200 pt-4 text-sm text-[#64748b]">
                  <input {...register("termsAccepted")} type="checkbox" className="mt-0.5 h-4 w-4 accent-[#1a1a2e]" />
                  <span>{t("auth.signup.terms")}</span>
                </label>
                {errors.termsAccepted && <p className="text-xs text-rose-500">{errors.termsAccepted.message}</p>}
                {errors.root && <p className="border-l-2 border-rose-400 pl-3 text-xs text-rose-500">{errors.root.message}</p>}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-9 flex items-center gap-4">
          {step > 0 && (
            <button
              type="button"
              onClick={prevStep}
              className="text-sm font-semibold uppercase tracking-[0.12em] text-[#94a3b8] transition hover:text-[#1a1a2e]"
            >
              {t("auth.signup.back")}
            </button>
          )}
          {step < 2 ? (
            <button
              type="button"
              onClick={nextStep}
              className="group ml-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#1a1a2e] px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-black"
            >
              {t("auth.signup.continue")}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#1a1a2e] px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-black disabled:opacity-70"
            >
              {isSubmitting ? t("auth.signup.creating") : t("auth.signup.createAccount", { role })}
            </button>
          )}
        </div>
      </form>

      {step === 0 && (
        <p className="mt-10 text-sm text-[#64748b]">
          {t("auth.signup.alreadyAccount")}{" "}
          <Link href="/login" className="font-semibold text-[#1a1a2e] underline underline-offset-4">
            {t("auth.signup.login")}
          </Link>
        </p>
      )}
    </div>
  );
}

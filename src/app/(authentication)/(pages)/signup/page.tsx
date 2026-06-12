"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { SignupFormField, signupSchema } from "@/app/(authentication)/_types/_schemas/index";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import PillField from "../../_components/PillField";
import PillOtp from "../../_components/PillOtp";
import {
  authRoleOptions,
  defaultSignupValues,
  demoVerificationCode,
  signupStepFields,
} from "../../_constants";

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
    <div className="w-full max-w-sm text-center">
      <Link href="/" className="font-serif text-3xl leading-none text-white">
        Dwelve
      </Link>
      <h1 className="mt-9 text-2xl font-semibold tracking-tight text-white">{t("auth.signup.title")}</h1>

      {/* dot stepper */}
      <div className="mt-5 flex justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === step ? "w-7 bg-white" : i < step ? "w-2 bg-white/70" : "w-2 bg-white/25"
            }`}
          />
        ))}
      </div>

      <form className="mt-8" onSubmit={handleSubmit(onSubmit)} noValidate>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, y: reduce ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -10 }}
            transition={{ duration: 0.26 }}
            className="space-y-5"
          >
            {step === 0 && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  {authRoleOptions.map(({ value, labelKey }) => {
                    const active = role === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setValue("role", value, { shouldValidate: true })}
                        className={`rounded-full border px-4 py-3 text-sm font-medium backdrop-blur-md transition-all ${
                          active ? "border-white/60 bg-white/20 text-white" : "border-white/15 bg-white/10 text-white/70 hover:bg-white/15"
                        }`}
                      >
                        {t(labelKey)}
                      </button>
                    );
                  })}
                </div>
                <PillField {...register("fullName")} type="text" label={t("auth.signup.fullName")} placeholder={t("auth.signup.fullNamePlaceholder")} error={errors.fullName?.message} />
                <PillField {...register("email")} type="email" label={t("auth.signup.email")} placeholder={t("auth.signup.emailPlaceholder")} error={errors.email?.message} />
              </>
            )}

            {step === 1 && (
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/50">{t("auth.signup.verificationLabel")}</p>
                <p className="mx-auto mb-5 mt-2 max-w-xs text-xs text-white/55">
                  {t("auth.signup.demoCode")}: <span className="font-semibold text-white">{demoVerificationCode}</span>
                </p>
                <Controller
                  control={control}
                  name="verificationCode"
                  render={({ field }) => (
                    <PillOtp
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
                {errors.verificationCode && <p className="mt-3 text-xs text-rose-200">{errors.verificationCode.message}</p>}
              </div>
            )}

            {step === 2 && (
              <>
                <PillField {...register("username")} type="text" label={t("auth.signup.username")} placeholder={t("auth.signup.usernamePlaceholder")} error={errors.username?.message} />
                <PillField
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  label={t("auth.signup.password")}
                  placeholder={t("auth.signup.createPasswordPlaceholder")}
                  error={errors.password?.message}
                  trailing={
                    <button type="button" onClick={() => setShowPassword((p) => !p)} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition hover:bg-white/15 hover:text-white" aria-label={showPassword ? t("auth.signup.hidePassword") : t("auth.signup.showPassword")}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                />
                <PillField
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  label={t("auth.signup.confirmPassword")}
                  placeholder={t("auth.signup.confirmPasswordPlaceholder")}
                  error={errors.confirmPassword?.message}
                  trailing={
                    <button type="button" onClick={() => setShowConfirmPassword((p) => !p)} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition hover:bg-white/15 hover:text-white" aria-label={showConfirmPassword ? t("auth.signup.hideConfirmPassword") : t("auth.signup.showConfirmPassword")}>
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                />
                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/15 bg-white/10 p-3.5 text-left text-sm text-white/75 backdrop-blur-md">
                  <input {...register("termsAccepted")} type="checkbox" className="mt-0.5 h-4 w-4 accent-white" />
                  <span>{t("auth.signup.terms")}</span>
                </label>
                {errors.termsAccepted && <p className="text-xs text-rose-200">{errors.termsAccepted.message}</p>}
                {errors.root && <p className="rounded-xl border border-rose-300/20 bg-rose-500/15 px-3 py-2 text-xs text-rose-100">{errors.root.message}</p>}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-center gap-5">
          {step > 0 && (
            <button type="button" onClick={prevStep} className="text-xs font-medium uppercase tracking-[0.16em] text-white/55 transition hover:text-white">
              {t("auth.signup.back")}
            </button>
          )}
          {step < 2 ? (
            <button type="button" onClick={nextStep} className="inline-flex min-w-40 items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#0b0f1a] transition hover:bg-white/90">
              {t("auth.signup.continue")}
            </button>
          ) : (
            <button type="submit" disabled={isSubmitting} className="inline-flex min-w-40 items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#0b0f1a] transition hover:bg-white/90 disabled:opacity-70">
              {isSubmitting ? t("auth.signup.creating") : t("auth.signup.createAccount", { role })}
            </button>
          )}
        </div>
      </form>

      {step === 0 && (
        <p className="mt-9 text-sm text-white/60">
          {t("auth.signup.alreadyAccount")}{" "}
          <Link href="/login" className="font-semibold text-white underline-offset-4 hover:underline">
            {t("auth.signup.login")}
          </Link>
        </p>
      )}
    </div>
  );
}

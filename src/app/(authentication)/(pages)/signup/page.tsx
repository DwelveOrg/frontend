"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Eye, EyeOff, GraduationCap, Presentation, Check } from "lucide-react";
import { SignupFormField, signupSchema } from "@/app/(authentication)/_types/_schemas/index";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import GlassField from "../../_components/GlassField";
import GlassOtp from "../../_components/GlassOtp";
import {
  defaultSignupValues,
  demoVerificationCode,
  signupStepCount,
  signupStepFields,
} from "../../_constants";

const roleOptions = [
  { value: "student", icon: GraduationCap, labelKey: "auth.signup.student" },
  { value: "teacher", icon: Presentation, labelKey: "auth.signup.teacher" },
] as const;

export default function SignupPage() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
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

    setDirection(1);
    setStep((prev) => Math.min(prev + 1, 2));
  };

  const prevStep = () => {
    setValue("verificationCode", "");
    clearErrors("verificationCode");
    setDirection(-1);
    setStep((prev) => (prev === 2 ? 0 : Math.max(prev - 1, 0)));
  };

  const onSubmit: SubmitHandler<SignupFormField> = async () => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    setError("root", { message: t("auth.signup.backendMissing") });
  };

  const slide = {
    enter: (dir: number) => ({ opacity: 0, x: reduce ? 0 : dir * 36 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: reduce ? 0 : dir * -36 }),
  };

  return (
    <div className="w-full max-w-lg rounded-[28px] border border-white/15 bg-white/[0.08] p-8 shadow-[0_30px_90px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
      <div className="flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl leading-none text-white">
          Dwelve
        </Link>
        <Link
          href="/"
          aria-label={t("auth.common.backToLanding")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>

      <h1 className="mt-8 text-3xl font-bold tracking-tight text-white">{t("auth.signup.title")}</h1>
      <p className="mt-2 text-sm text-white/65">{t("auth.signup.subtitle")}</p>

      {/* Segmented stepper */}
      <div className="mt-7">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-white/60">
          <span>{t("auth.signup.step", { current: step + 1, total: 3 })}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: i <= step ? "100%" : "0%" }}
              />
            </div>
          ))}
        </div>
      </div>

      <form className="mt-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={step}
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              {step === 0 && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    {roleOptions.map(({ value, icon: Icon, labelKey }) => {
                      const active = role === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setValue("role", value, { shouldValidate: true })}
                          className={`flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-sm font-semibold backdrop-blur-md transition ${
                            active
                              ? "border-white/70 bg-white/20 text-white"
                              : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
                          }`}
                        >
                          <Icon className="h-6 w-6" />
                          {t(labelKey)}
                        </button>
                      );
                    })}
                  </div>
                  <GlassField {...register("fullName")} type="text" label={t("auth.signup.fullName")} error={errors.fullName?.message} />
                  <GlassField {...register("email")} type="email" label={t("auth.signup.email")} error={errors.email?.message} />
                </>
              )}

              {step === 1 && (
                <div>
                  <p className="mb-1 text-center text-sm font-medium text-white">
                    {t("auth.signup.verificationLabel")}
                  </p>
                  <p className="mb-5 text-center text-xs text-white/60">
                    {t("auth.signup.verificationHelp", { email: email || t("auth.signup.yourEmail") })}{" "}
                    {t("auth.signup.demoCode")}: <span className="font-semibold text-white">{demoVerificationCode}</span>
                  </p>
                  <Controller
                    control={control}
                    name="verificationCode"
                    render={({ field }) => (
                      <GlassOtp
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
                  {errors.verificationCode && (
                    <p className="mt-3 text-center text-xs text-rose-200">{errors.verificationCode.message}</p>
                  )}
                </div>
              )}

              {step === 2 && (
                <>
                  <GlassField {...register("username")} type="text" label={t("auth.signup.username")} error={errors.username?.message} />
                  <GlassField
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    label={t("auth.signup.password")}
                    error={errors.password?.message}
                    trailing={
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-white/70 transition hover:bg-white/15 hover:text-white"
                        aria-label={showPassword ? t("auth.signup.hidePassword") : t("auth.signup.showPassword")}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    }
                  />
                  <GlassField
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    label={t("auth.signup.confirmPassword")}
                    error={errors.confirmPassword?.message}
                    trailing={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((p) => !p)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-white/70 transition hover:bg-white/15 hover:text-white"
                        aria-label={showConfirmPassword ? t("auth.signup.hideConfirmPassword") : t("auth.signup.showConfirmPassword")}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    }
                  />
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/15 bg-white/5 p-4 text-sm text-white/75 backdrop-blur-md transition hover:bg-white/10">
                    <input {...register("termsAccepted")} type="checkbox" className="mt-0.5 h-4 w-4 accent-white" />
                    <span>{t("auth.signup.terms")}</span>
                  </label>
                  {errors.termsAccepted && <p className="-mt-2 text-xs text-rose-200">{errors.termsAccepted.message}</p>}
                  {errors.root && (
                    <p className="rounded-xl border border-rose-300/30 bg-rose-500/15 px-3 py-2 text-xs text-rose-100">{errors.root.message}</p>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={prevStep}
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
            >
              {t("auth.signup.back")}
            </button>
          )}
          {step < 2 ? (
            <button
              type="button"
              onClick={nextStep}
              className="group inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-white text-sm font-semibold text-[#1a1a2e] shadow-[0_14px_40px_rgba(255,255,255,0.18)] transition hover:bg-white/90"
            >
              {t("auth.signup.continue")}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-white text-sm font-semibold text-[#1a1a2e] shadow-[0_14px_40px_rgba(255,255,255,0.18)] transition hover:bg-white/90 disabled:opacity-70"
            >
              {isSubmitting ? t("auth.signup.creating") : (
                <>
                  <Check className="h-4 w-4" />
                  {t("auth.signup.createAccount", { role })}
                </>
              )}
            </button>
          )}
        </div>
      </form>

      {step === 0 && (
        <p className="mt-7 text-center text-sm text-white/65">
          {t("auth.signup.alreadyAccount")}{" "}
          <Link href="/login" className="font-semibold text-white underline-offset-4 hover:underline">
            {t("auth.signup.login")}
          </Link>
        </p>
      )}
    </div>
  );
}

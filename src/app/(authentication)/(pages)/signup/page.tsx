"use client";

import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, GraduationCap, Presentation } from "lucide-react";
import { SignupFormField, signupSchema } from "@/app/(authentication)/_types/_schemas/index";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import BrutalField from "../../_components/BrutalField";
import BrutalOtp from "../../_components/BrutalOtp";
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

  const eyeBtn = (shown: boolean, toggle: () => void, label: string) => (
    <button type="button" onClick={toggle} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-black transition hover:text-[#4F46E5]" aria-label={label}>
      {shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );

  return (
    <div className="w-full max-w-md rounded-2xl border-[3px] border-black bg-white p-7 shadow-[8px_8px_0_0_#000]">
      <div className="flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl leading-none text-black lg:hidden">
          Dwelve
        </Link>
        <Link
          href="/"
          aria-label={t("auth.common.backToLanding")}
          className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-lg border-2 border-black bg-white text-black shadow-[2px_2px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#4F46E5]"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>

      <h1 className="mt-6 text-3xl font-black uppercase tracking-tight text-black">{t("auth.signup.title")}</h1>

      {/* chunky block stepper */}
      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between text-xs font-extrabold uppercase tracking-wide text-black">
          <span>{t("auth.signup.step", { current: step + 1, total: 3 })}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-3 flex-1 rounded-md border-2 border-black transition-colors ${
                i <= step ? "bg-[#4F46E5]" : "bg-white"
              }`}
            />
          ))}
        </div>
      </div>

      <form className="mt-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: reduce ? 0 : 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduce ? 0 : -24 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            {step === 0 && (
              <>
                <div>
                  <p className="mb-1.5 text-xs font-extrabold uppercase tracking-wide text-black">
                    {t("auth.signup.student")} / {t("auth.signup.teacher")}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {roleOptions.map(({ value, icon: Icon, labelKey }) => {
                      const active = role === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setValue("role", value, { shouldValidate: true })}
                          className={`flex flex-col items-center gap-2 rounded-xl border-2 border-black px-3 py-4 text-sm font-extrabold uppercase tracking-wide shadow-[4px_4px_0_0_#000] transition-all hover:-translate-y-0.5 ${
                            active ? "bg-[#4F46E5] text-white" : "bg-white text-black"
                          }`}
                        >
                          <Icon className="h-6 w-6" />
                          {t(labelKey)}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <BrutalField {...register("fullName")} type="text" label={t("auth.signup.fullName")} placeholder={t("auth.signup.fullNamePlaceholder")} error={errors.fullName?.message} />
                <BrutalField {...register("email")} type="email" label={t("auth.signup.email")} placeholder={t("auth.signup.emailPlaceholder")} error={errors.email?.message} />
              </>
            )}

            {step === 1 && (
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wide text-black">{t("auth.signup.verificationLabel")}</p>
                <p className="mb-5 mt-1.5 text-sm font-medium text-neutral-600">
                  {t("auth.signup.verificationHelp", { email: email || t("auth.signup.yourEmail") })}{" "}
                  {t("auth.signup.demoCode")}: <span className="font-extrabold text-[#4F46E5]">{demoVerificationCode}</span>
                </p>
                <Controller
                  control={control}
                  name="verificationCode"
                  render={({ field }) => (
                    <BrutalOtp
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
                {errors.verificationCode && <p className="mt-3 text-xs font-bold text-red-600">{errors.verificationCode.message}</p>}
              </div>
            )}

            {step === 2 && (
              <>
                <BrutalField {...register("username")} type="text" label={t("auth.signup.username")} placeholder={t("auth.signup.usernamePlaceholder")} error={errors.username?.message} />
                <BrutalField
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  label={t("auth.signup.password")}
                  placeholder={t("auth.signup.createPasswordPlaceholder")}
                  error={errors.password?.message}
                  trailing={eyeBtn(showPassword, () => setShowPassword((p) => !p), showPassword ? t("auth.signup.hidePassword") : t("auth.signup.showPassword"))}
                />
                <BrutalField
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  label={t("auth.signup.confirmPassword")}
                  placeholder={t("auth.signup.confirmPasswordPlaceholder")}
                  error={errors.confirmPassword?.message}
                  trailing={eyeBtn(showConfirmPassword, () => setShowConfirmPassword((p) => !p), showConfirmPassword ? t("auth.signup.hideConfirmPassword") : t("auth.signup.showConfirmPassword"))}
                />
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-black bg-[#f4f1e9] p-3.5 text-sm font-medium text-black shadow-[4px_4px_0_0_#000]">
                  <input {...register("termsAccepted")} type="checkbox" className="mt-0.5 h-4 w-4 accent-[#4F46E5]" />
                  <span>{t("auth.signup.terms")}</span>
                </label>
                {errors.termsAccepted && <p className="text-xs font-bold text-red-600">{errors.termsAccepted.message}</p>}
                {errors.root && (
                  <p className="rounded-lg border-2 border-black bg-red-100 px-3 py-2 text-xs font-bold text-red-700 shadow-[3px_3px_0_0_#000]">{errors.root.message}</p>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex items-center gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={prevStep}
              className="inline-flex items-center justify-center rounded-xl border-2 border-black bg-white px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-black shadow-[4px_4px_0_0_#000] transition-all hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              {t("auth.signup.back")}
            </button>
          )}
          {step < 2 ? (
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex flex-1 items-center justify-center rounded-xl border-2 border-black bg-[#4F46E5] py-3 text-sm font-extrabold uppercase tracking-wide text-white shadow-[5px_5px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              {t("auth.signup.continue")}
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex flex-1 items-center justify-center rounded-xl border-2 border-black bg-[#34D399] py-3 text-sm font-extrabold uppercase tracking-wide text-black shadow-[5px_5px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-70"
            >
              {isSubmitting ? t("auth.signup.creating") : t("auth.signup.createAccount", { role })}
            </button>
          )}
        </div>
      </form>

      {step === 0 && (
        <p className="mt-6 text-center text-sm font-medium text-neutral-600">
          {t("auth.signup.alreadyAccount")}{" "}
          <Link href="/login" className="font-extrabold text-black underline underline-offset-2">
            {t("auth.signup.login")}
          </Link>
        </p>
      )}
    </div>
  );
}

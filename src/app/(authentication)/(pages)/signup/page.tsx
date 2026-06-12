"use client";

import Link from "next/link";
import Input from "@/components/ui/Input";
import Btn from "@/components/Custom/CustomButton";
import { ArrowLeft, Eye, EyeOff, GraduationCap, Presentation } from "lucide-react";
import { SignupFormField, signupSchema } from "@/app/(authentication)/_types/_schemas/index";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/InputOTP";
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
        setError("verificationCode", {
          message: t("auth.signup.verificationIncorrect"),
        });
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
    setStep((prev) => {
      if (prev === 2) return 0;
      return Math.max(prev - 1, 0);
    });
  };

  const onSubmit: SubmitHandler<SignupFormField> = async () => {
    // Backend is not connected yet — simulate the request, then surface the
    // UI-only notice instead of pretending the account was created.
    await new Promise((resolve) => setTimeout(resolve, 700));
    setError("root", {
      message: t("auth.signup.backendMissing"),
    });
  };

  return (
    <section className="w-full">
      <div className="relative mx-auto w-full max-w-xl rounded-2xl border border-slate-200/80 bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#111726] dark:shadow-[0_18px_50px_rgba(0,0,0,0.5)]">
        <Link
          href="/"
          aria-label={t("auth.common.backToLanding")}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#64748b] transition hover:border-slate-300 hover:bg-slate-50 hover:text-[#1a1a2e] dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="mb-6">
          <Link href="/" className="inline-flex items-center">
            <span className="font-serif text-[22px] leading-none text-[#1a1a2e] dark:text-white">
              Dwelve
            </span>
          </Link>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-[#1a1a2e] dark:text-white">
            {t("auth.signup.title")}
          </h2>
          <p className="mt-2 text-sm text-[#64748b] dark:text-slate-300">
            {t("auth.signup.subtitle")}
          </p>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-[#64748b] dark:text-slate-300">
            <span>{t("auth.signup.step", { current: step + 1, total: 3 })}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <div
              className="h-2 rounded-full bg-[#4F46E5] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          {step === 0 && (
            <>
              <div>
                <div className="grid grid-cols-2 gap-3">
                  {roleOptions.map(({ value, icon: Icon, labelKey }) => {
                    const active = role === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setValue("role", value, { shouldValidate: true })}
                        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border px-3 py-4 text-sm font-semibold transition ${
                          active
                            ? "border-[#4F46E5] bg-indigo-50 text-[#4F46E5] dark:border-indigo-400/50 dark:bg-indigo-500/15 dark:text-indigo-200"
                            : "border-slate-200 text-[#64748b] hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                        {t(labelKey)}
                      </button>
                    );
                  })}
                </div>
                {errors.role && (
                  <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.role.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#1a1a2e] dark:text-white">{t("auth.signup.fullName")}</label>
                <Input
                  {...register("fullName")}
                  type="text"
                  placeholder={t("auth.signup.fullNamePlaceholder")}
                  className={errors.fullName ? "border-red-500 focus:border-red-500 dark:border-red-400" : ""}
                />
                {errors.fullName && (
                  <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#1a1a2e] dark:text-white">{t("auth.signup.email")}</label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder={t("auth.signup.emailPlaceholder")}
                  className={errors.email ? "border-red-500 focus:border-red-500 dark:border-red-400" : ""}
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>
                )}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#1a1a2e] dark:text-white">
                  {t("auth.signup.verificationLabel")}
                </label>
                <p className="mb-3 text-xs text-[#64748b] dark:text-slate-300">
                  {t("auth.signup.verificationHelp", { email: email || t("auth.signup.yourEmail") })}{" "}
                  {t("auth.signup.demoCode")}: <span className="font-semibold text-[#4F46E5] dark:text-indigo-300">{demoVerificationCode}</span>
                </p>
                <div className="flex w-full justify-center">
                  <Controller
                    control={control}
                    name="verificationCode"
                    render={({ field }) => (
                      <InputOTP
                        maxLength={6}
                        autoFocus={step === 1}
                        value={field.value ?? ""}
                        onChange={(value) => {
                          field.onChange(value);
                          if (errors.verificationCode) clearErrors("verificationCode");
                        }}
                        containerClassName="w-full justify-center"
                      >
                        <InputOTPGroup className="justify-center">
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    )}
                  />
                </div>
                {errors.verificationCode && (
                  <p className="mt-2 text-center text-xs text-red-600 dark:text-red-400">{errors.verificationCode.message}</p>
                )}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#1a1a2e] dark:text-white">{t("auth.signup.username")}</label>
                <Input
                  {...register("username")}
                  type="text"
                  placeholder={t("auth.signup.usernamePlaceholder")}
                  className={errors.username ? "border-red-500 focus:border-red-500 dark:border-red-400" : ""}
                />
                {errors.username && (
                  <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#1a1a2e] dark:text-white">{t("auth.signup.password")}</label>
                <div className="relative">
                  <Input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.signup.createPasswordPlaceholder")}
                    className={`pr-11 ${errors.password ? "border-red-500 focus:border-red-500 dark:border-red-400" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-1 right-1 inline-flex w-8 cursor-pointer items-center justify-center rounded-md text-[#94a3b8] transition hover:bg-slate-100 hover:text-[#4F46E5] focus-visible:outline-none dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                    aria-label={showPassword ? t("auth.signup.hidePassword") : t("auth.signup.showPassword")}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#1a1a2e] dark:text-white">{t("auth.signup.confirmPassword")}</label>
                <div className="relative">
                  <Input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t("auth.signup.confirmPasswordPlaceholder")}
                    className={`pr-11 ${errors.confirmPassword ? "border-red-500 focus:border-red-500 dark:border-red-400" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-1 right-1 inline-flex w-8 cursor-pointer items-center justify-center rounded-md text-[#94a3b8] transition hover:bg-slate-100 hover:text-[#4F46E5] focus-visible:outline-none dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                    aria-label={showConfirmPassword ? t("auth.signup.hideConfirmPassword") : t("auth.signup.showConfirmPassword")}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
                )}
              </div>

              <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-200 p-3.5 text-sm text-[#64748b] transition hover:border-slate-300 dark:border-white/10 dark:text-slate-300 dark:hover:border-white/20">
                <input
                  {...register("termsAccepted")}
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 accent-[#4F46E5]"
                />
                <span>
                  {t("auth.signup.terms")}
                </span>
              </label>
              {errors.termsAccepted && (
                <p className="-mt-2 text-xs text-red-600 dark:text-red-400">{errors.termsAccepted.message}</p>
              )}

              {errors.root && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-500/10 dark:text-red-400">{errors.root.message}</p>
              )}
            </>
          )}

          <div className="flex flex-col-reverse gap-2.5 pt-2 sm:flex-row sm:justify-between">
            <Btn
              type="button"
              onClick={prevStep}
              disabled={step === 0}
              className="w-full border border-slate-200 bg-white text-[#1a1a2e] shadow-none hover:border-slate-300 hover:bg-slate-50 hover:text-[#1a1a2e] hover:shadow-none focus-visible:ring-slate-300/40 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white sm:w-auto sm:min-w-28"
            >
              {t("auth.signup.back")}
            </Btn>

            {step < 2 ? (
              <Btn type="button" onClick={nextStep} className="w-full sm:w-auto sm:min-w-32">
                {t("auth.signup.continue")}
              </Btn>
            ) : (
              <Btn type="submit" disabled={isSubmitting} className="w-full sm:w-auto sm:min-w-40">
                {isSubmitting ? t("auth.signup.creating") : t("auth.signup.createAccount", { role })}
              </Btn>
            )}
          </div>
        </form>

        {step === 0 && (
          <p className="mt-6 text-center text-sm text-[#64748b] dark:text-slate-300">
            {t("auth.signup.alreadyAccount")}{" "}
            <Link href="/login" className="font-semibold text-[#4F46E5] hover:underline dark:text-indigo-300">
              {t("auth.signup.login")}
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}

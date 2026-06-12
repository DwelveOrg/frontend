"use client";

import Link from "next/link";
import Input from "@/components/ui/Input";
import Btn from "@/components/Custom/CustomButton";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
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
  authRoleOptions,
  defaultSignupValues,
  demoVerificationCode,
  signupStepCount,
  signupStepFields,
} from "../../_constants";

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
    await new Promise((resolve) => setTimeout(resolve, 900));
    setError("root", {
      message: t("auth.signup.backendMissing"),
    });
  };

  return (
    <section className="w-full px-4">
      <div className="mx-auto relative w-full max-w-xl rounded-2xl border border-black/10 bg-white/80 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur dark:border-white/10 dark:bg-[#111827]/80">
        <div className="mb-6">
          <div className="flex justify-end">
            <Link
              href="/"
              aria-label={t("auth.common.backToLanding")}
              className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#c7d8ff] bg-white text-[#0F2854] transition hover:bg-[#eef4ff] hover:text-[#0046FF] dark:border-white/15 dark:bg-[#0b1220] dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <span className="inline-flex items-center gap-0.5">
                <ArrowLeft className="h-3.5 w-3.5" />
                {/* <House className="h-3.5 w-3.5" /> */}
              </span>
            </Link>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0046FF] dark:text-[#8fb0ff]">
            {t("auth.signup.access")}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-[#0F2854] dark:text-white">
            {t("auth.signup.title")}
          </h2>
          <p className="mt-2 text-sm text-[#355181] dark:text-slate-300">
            {t("auth.signup.subtitle")}
          </p>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-[#355181] dark:text-slate-300">
            <span>{t("auth.signup.step", { current: step + 1, total: 3 })}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 rounded-full bg-black/5 dark:bg-white/10">
            <div
              className="h-2 rounded-full bg-[#0046FF] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          {step === 0 && (
            <>
              <div>
                <div className="grid grid-cols-2 gap-2">
                  {authRoleOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setValue("role", option.value, { shouldValidate: true })}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition cursor-pointer ${role === option.value
                        ? "border-[#0046FF] bg-[#e9f1ff] text-[#0046FF] dark:bg-[#1e2f55]"
                        : "border-black/10 text-[#355181] hover:bg-[#f4f8ff] dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
                        }`}
                    >
                      {t(option.labelKey)}
                    </button>
                  ))}
                </div>
                {errors.role && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.role.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#0F2854] dark:text-white">{t("auth.signup.fullName")}</label>
                <Input
                  {...register("fullName")}
                  type="text"
                  placeholder={t("auth.signup.fullNamePlaceholder")}
                  className={`w-full ${errors.fullName ? "border-red-500 focus:border-red-500 dark:border-red-400" : ""}`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#0F2854] dark:text-white">{t("auth.signup.email")}</label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder={t("auth.signup.emailPlaceholder")}
                  className={`w-full ${errors.email ? "border-red-500 focus:border-red-500 dark:border-red-400" : ""}`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>
                )}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#0F2854] dark:text-white">
                  {t("auth.signup.verificationLabel")}
                </label>
                <p className="mb-2 text-xs text-[#355181] dark:text-slate-300">
                  {t("auth.signup.verificationHelp", { email: email || t("auth.signup.yourEmail") })}{" "}
                  {t("auth.signup.demoCode")}: <span className="font-semibold text-[#0046FF]">{demoVerificationCode}</span>
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
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.verificationCode.message}</p>
                )}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#0F2854] dark:text-white">{t("auth.signup.username")}</label>
                <Input
                  {...register("username")}
                  type="text"
                  placeholder={t("auth.signup.usernamePlaceholder")}
                  className={`w-full ${errors.username ? "border-red-500 focus:border-red-500 dark:border-red-400" : ""}`}
                />
                {errors.username && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#0F2854] dark:text-white">{t("auth.signup.password")}</label>
                <div className="relative">
                  <Input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.signup.createPasswordPlaceholder")}
                    className={`w-full pr-11 ${errors.password ? "border-red-500 focus:border-red-500 dark:border-red-400" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-1 right-1 inline-flex w-8 cursor-pointer items-center justify-center rounded-md text-[#355181] transition hover:bg-slate-100 hover:text-[#0046FF] focus-visible:outline-none dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                    aria-label={showPassword ? t("auth.signup.hidePassword") : t("auth.signup.showPassword")}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#0F2854] dark:text-white">{t("auth.signup.confirmPassword")}</label>
                <div className="relative">
                  <Input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t("auth.signup.confirmPasswordPlaceholder")}
                    className={`w-full pr-11 ${errors.confirmPassword ? "border-red-500 focus:border-red-500 dark:border-red-400" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-1 right-1 inline-flex w-8 cursor-pointer items-center justify-center rounded-md text-[#355181] transition hover:bg-slate-100 hover:text-[#0046FF] focus-visible:outline-none dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                    aria-label={showConfirmPassword ? t("auth.signup.hideConfirmPassword") : t("auth.signup.showConfirmPassword")}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
                )}
              </div>

              <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-black/10 p-3 text-sm text-[#355181] dark:border-white/10 dark:text-slate-300">
                <input
                  {...register("termsAccepted")}
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 accent-[#0046FF]"
                />
                <span>
                  {t("auth.signup.terms")}
                </span>
              </label>
              {errors.termsAccepted && (
                <p className="-mt-2 text-xs text-red-600 dark:text-red-400">{errors.termsAccepted.message}</p>
              )}

              {errors.root && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.root.message}</p>
              )}
            </>
          )}

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-between">
            <Btn
              type="button"
              onClick={prevStep}
              disabled={step === 0 ? true : false}
              className={`mt-0 w-full border border-[#c7d8ff] bg-white text-[#0F2854] hover:bg-[#eef4ff] hover:text-[#0046FF] dark:border-white/15 dark:bg-[#0b1220] dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white sm:w-auto sm:min-w-28 `}
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

        {step === 0 && (<p className="mt-5 text-center text-sm text-[#355181] dark:text-slate-300">
          {t("auth.signup.alreadyAccount")}{" "}
          <Link href="/login" className="font-semibold text-[#0046FF]">
            {t("auth.signup.login")}
          </Link>
        </p>)}
      </div>
    </section>
  );
}


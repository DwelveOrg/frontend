"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Btn from "@/components/Custom/CustomButton";
import { ArrowLeft, Eye, EyeOff, LoaderCircle } from "lucide-react";
import React, { startTransition, useActionState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { loginSchema, LoginFormField } from "@/app/(authentication)/_types/_schemas/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { login, type LoginActionState } from "../../_lib/actions";

type LoginPageClientProps = {
  logout?: string;
};

export default function LoginPageClient({ logout }: Readonly<LoginPageClientProps>) {
  const { t } = useTranslation();
  const router = useRouter();
  const logoutToastShownRef = React.useRef(false);
  const [state, loginAction, isActionPending] = useActionState<LoginActionState, FormData>(
    login,
    { error: null, success: false }
  );
  const [showPassword, setShowPassword] = React.useState(false);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormField>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  React.useEffect(() => {
    if (state.error) {
      setError("root", { message: state.error });
      toast.error(state.error);
    } else if (state.success) {
      clearErrors("root");
      toast.success(t("auth.login.success"));
      router.push(state.redirectTo ?? "/dashboard");
    }
  }, [state, setError, clearErrors, router, t]);

  React.useEffect(() => {
    if (logout !== "1" || logoutToastShownRef.current) return;
    logoutToastShownRef.current = true;
    toast.success(t("auth.login.logoutSuccess"));
    router.replace("/login");
  }, [logout, router, t]);

  const onSubmit: SubmitHandler<LoginFormField> = async (data) => {
    clearErrors("root");
    const formData = new FormData();
    formData.set("identifier", data.identifier);
    formData.set("password", data.password);
    startTransition(() => {
      loginAction(formData);
    });
  };

  const isBusy = isSubmitting || isActionPending;

  return (
    <section className="w-full">
      <div className="relative mx-auto w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#111726] dark:shadow-[0_18px_50px_rgba(0,0,0,0.5)]">
        <Link
          href="/"
          aria-label={t("auth.common.backToLanding")}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#64748b] transition hover:border-slate-300 hover:bg-slate-50 hover:text-[#1a1a2e] dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="mb-7">
          <Link href="/" className="inline-flex items-center">
            <span className="font-serif text-[22px] leading-none text-[#1a1a2e] dark:text-white">
              Dwelve
            </span>
          </Link>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-[#1a1a2e] dark:text-white">
            {t("auth.login.title")}
          </h2>
          <p className="mt-2 text-sm text-[#64748b] dark:text-slate-300">
            {t("auth.login.subtitle")}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1a1a2e] dark:text-white">
              {t("auth.login.loginLabel")}
            </label>
            <Input
              {...register("identifier")}
              type="text"
              placeholder={t("auth.login.loginPlaceholder")}
              className={errors.identifier ? "border-red-500 focus:border-red-500 dark:border-red-400" : ""}
            />
            {errors.identifier && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                {errors.identifier.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="mb-1.5 block text-sm font-medium text-[#1a1a2e] dark:text-white">
                {t("auth.login.passwordLabel")}
              </label>
              <Link
                href="/password-reset"
                className="block text-sm font-medium text-[#4F46E5] hover:underline dark:text-indigo-300"
              >
                {t("auth.login.forgot")}
              </Link>
            </div>
            <div className="relative">
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder={t("auth.login.passwordPlaceholder")}
                className={`pr-11 ${errors.password ? "border-red-500 focus:border-red-500 dark:border-red-400" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-1 right-1 inline-flex w-8 cursor-pointer items-center justify-center rounded-md text-[#94a3b8] transition hover:bg-slate-100 hover:text-[#4F46E5] focus-visible:outline-none dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label={showPassword ? t("auth.login.hidePassword") : t("auth.login.showPassword")}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                {errors.password.message}
              </p>
            )}
            {errors.root && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                {errors.root.message}
              </p>
            )}
          </div>

          <Btn type="submit" className="w-full" disabled={isBusy}>
            {isBusy ? <LoaderCircle className="h-5 w-5 animate-spin" /> : t("auth.login.submit")}
          </Btn>
        </form>

        <p className="mt-6 text-center text-sm text-[#64748b] dark:text-slate-300">
          {t("auth.login.noAccount")}{" "}
          <Link href="/signup" className="font-semibold text-[#4F46E5] hover:underline dark:text-indigo-300">
            {t("auth.login.signup")}
          </Link>
        </p>
      </div>
    </section>
  );
}

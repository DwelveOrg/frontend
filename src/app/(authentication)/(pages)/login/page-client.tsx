"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, LoaderCircle, ArrowRight } from "lucide-react";
import React, { startTransition, useActionState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { loginSchema, LoginFormField } from "@/app/(authentication)/_types/_schemas/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import type { LoginPageClientProps } from "@/app/(authentication)/_types";
import { login, type LoginActionState } from "../../_lib/actions";
import NeonField from "../../_components/NeonField";

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
    defaultValues: { identifier: "", password: "" },
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
    startTransition(() => loginAction(formData));
  };

  const isBusy = isSubmitting || isActionPending;

  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.05] p-8 shadow-[0_30px_90px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.9)]" />
          <span className="font-serif text-2xl leading-none text-white">Dwelve</span>
        </Link>
        <Link
          href="/"
          aria-label={t("auth.common.backToLanding")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>

      <h1 className="mt-8 text-3xl font-bold tracking-tight text-white">{t("auth.login.title")}</h1>
      <p className="mt-2 text-sm text-slate-400">{t("auth.login.subtitle")}</p>

      <form className="mt-7 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <NeonField
          {...register("identifier")}
          type="text"
          label={t("auth.login.loginLabel")}
          placeholder={t("auth.login.loginPlaceholder")}
          error={errors.identifier?.message}
        />

        <div>
          <NeonField
            {...register("password")}
            type={showPassword ? "text" : "password"}
            label={t("auth.login.passwordLabel")}
            placeholder={t("auth.login.passwordPlaceholder")}
            error={errors.password?.message}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white"
                aria-label={showPassword ? t("auth.login.hidePassword") : t("auth.login.showPassword")}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          <div className="mt-2 flex justify-end">
            <Link href="/password-reset" className="text-sm font-medium text-indigo-300 transition hover:text-indigo-200">
              {t("auth.login.forgot")}
            </Link>
          </div>
        </div>

        {errors.root && <p className="text-xs text-rose-300">{errors.root.message}</p>}

        <button
          type="submit"
          disabled={isBusy}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-400 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all duration-200 hover:shadow-[0_0_44px_rgba(99,102,241,0.6)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isBusy ? (
            <LoaderCircle className="h-5 w-5 animate-spin" />
          ) : (
            <>
              {t("auth.login.submit")}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-400">
        {t("auth.login.noAccount")}{" "}
        <Link href="/signup" className="font-semibold text-white hover:text-indigo-200">
          {t("auth.login.signup")}
        </Link>
      </p>
    </div>
  );
}

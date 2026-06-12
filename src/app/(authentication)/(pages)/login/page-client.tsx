"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import React, { startTransition, useActionState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { loginSchema, LoginFormField } from "@/app/(authentication)/_types/_schemas/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import type { LoginPageClientProps } from "@/app/(authentication)/_types";
import { login, type LoginActionState } from "../../_lib/actions";
import PillField from "../../_components/PillField";

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
    <div className="w-full max-w-sm text-center">
      <Link href="/" className="font-serif text-3xl leading-none text-white">
        Dwelve
      </Link>
      <h1 className="mt-9 text-2xl font-semibold tracking-tight text-white">{t("auth.login.title")}</h1>
      <p className="mx-auto mt-2 max-w-xs text-sm text-white/60">{t("auth.login.subtitle")}</p>

      <form className="mt-9 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <PillField
          {...register("identifier")}
          type="text"
          label={t("auth.login.loginLabel")}
          placeholder={t("auth.login.loginPlaceholder")}
          error={errors.identifier?.message}
        />

        <PillField
          {...register("password")}
          type={showPassword ? "text" : "password"}
          label={t("auth.login.passwordLabel")}
          placeholder={t("auth.login.passwordPlaceholder")}
          error={errors.password?.message}
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition hover:bg-white/15 hover:text-white"
              aria-label={showPassword ? t("auth.login.hidePassword") : t("auth.login.showPassword")}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        {errors.root && <p className="text-xs text-rose-200">{errors.root.message}</p>}

        <button
          type="submit"
          disabled={isBusy}
          className="inline-flex w-full items-center justify-center rounded-full bg-white py-3.5 text-sm font-semibold text-[#0b0f1a] transition-all duration-200 hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isBusy ? <LoaderCircle className="h-5 w-5 animate-spin" /> : t("auth.login.submit")}
        </button>

        <Link href="/password-reset" className="block text-xs font-medium uppercase tracking-[0.16em] text-white/55 transition hover:text-white">
          {t("auth.login.forgot")}
        </Link>
      </form>

      <p className="mt-9 text-sm text-white/60">
        {t("auth.login.noAccount")}{" "}
        <Link href="/signup" className="font-semibold text-white underline-offset-4 hover:underline">
          {t("auth.login.signup")}
        </Link>
      </p>
    </div>
  );
}

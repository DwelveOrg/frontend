"use client";

import React, { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, LoaderCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { createWorkspace } from "@/app/(authentication)/_lib/actions";
import {
  createWorkspaceSchema,
  type CreateWorkspaceFormField,
} from "@/app/(authentication)/_types/_schemas";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export default function CreateWorkspaceModal() {
  const { t } = useTranslation();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [slugTouched, setSlugTouched] = React.useState(false);
  const [isActionPending, startActionTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    clearErrors,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateWorkspaceFormField>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: { name: "", slug: "", phone: "", address: "" },
  });

  const nameRegistration = register("name");
  const slugRegistration = register("slug", {
    onChange: () => setSlugTouched(true),
  });

  const onSubmit: SubmitHandler<CreateWorkspaceFormField> = (data) => {
    clearErrors("root");

    const formData = new FormData();
    formData.set("name", data.name);
    formData.set("slug", data.slug);

    if (data.phone) formData.set("phone", data.phone);
    if (data.address) formData.set("address", data.address);

    startActionTransition(async () => {
      const result = await createWorkspace({ error: null, success: false }, formData);

      if (result.error) {
        setError("root", { message: result.error });
        toast.error(result.error);
        return;
      }

      clearErrors("root");
      toast.success(t("root.dashboard.workspaceModal.success"));
      reset();
      setSlugTouched(false);
      setOpen(false);
      router.refresh();
    });
  };

  const isBusy = isSubmitting || isActionPending;

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (!nextOpen) {
          setSlugTouched(false);
        }
      }}
    >
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-auto min-h-24 flex-col gap-2 whitespace-normal rounded-xl px-4 py-4 text-center"
        >
          <Building2 className="h-5 w-5" />
          <span className="text-sm font-semibold">
            {t("root.dashboard.empty.actions.createWorkspace")}
          </span>
          <span className="text-xs font-normal text-[var(--muted-foreground)]">
            {t("root.dashboard.empty.actions.createWorkspaceHint")}
          </span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[var(--muted-foreground)] transition hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
          aria-label={t("root.dashboard.workspaceModal.close")}
        >
          <X className="h-4 w-4" />
        </button>

        <AlertDialogHeader className="place-items-start text-left">
          <AlertDialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Building2 className="h-5 w-5 text-[var(--primary)]" />
            {t("root.dashboard.workspaceModal.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("root.dashboard.workspaceModal.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
              {t("root.dashboard.workspaceModal.fields.name.label")}
            </label>
            <Input
              {...nameRegistration}
              placeholder={t("root.dashboard.workspaceModal.fields.name.placeholder")}
              aria-invalid={Boolean(errors.name)}
              onChange={(event) => {
                nameRegistration.onChange(event);

                if (!slugTouched) {
                  setValue("slug", slugify(event.target.value), {
                    shouldDirty: true,
                    shouldValidate: false,
                  });
                }
              }}
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
              {t("root.dashboard.workspaceModal.fields.slug.label")}
            </label>
            <Input
              {...slugRegistration}
              placeholder={t("root.dashboard.workspaceModal.fields.slug.placeholder")}
              aria-invalid={Boolean(errors.slug)}
            />
            {errors.slug ? (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.slug.message}</p>
            ) : (
              <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">
                {t("root.dashboard.workspaceModal.fields.slug.help")}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                {t("root.dashboard.workspaceModal.fields.phone.label")}
              </label>
              <Input
                {...register("phone")}
                placeholder={t("root.dashboard.workspaceModal.fields.phone.placeholder")}
                aria-invalid={Boolean(errors.phone)}
              />
              {errors.phone && (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                {t("root.dashboard.workspaceModal.fields.address.label")}
              </label>
              <Input
                {...register("address")}
                placeholder={t("root.dashboard.workspaceModal.fields.address.placeholder")}
                aria-invalid={Boolean(errors.address)}
              />
              {errors.address && (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.address.message}</p>
              )}
            </div>
          </div>

          {errors.root && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400">
              {errors.root.message}
            </div>
          )}

          <AlertDialogFooter className="mt-2">
            <AlertDialogCancel type="button" disabled={isBusy}>
              {t("root.dashboard.workspaceModal.cancel")}
            </AlertDialogCancel>
            <Button type="submit" disabled={isBusy} className="h-9">
              {isBusy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              {t("root.dashboard.workspaceModal.submit")}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

"use client";

import { useMutation } from "@tanstack/react-query";

import { readSafeActionData } from "@/lib/actions/read-safe-action-result";
import type {
  LoginFormField,
  RegularSignupFormField,
} from "@/app/(authentication)/_types/_schemas";
import {
  loginAction,
  signupAction,
  type AuthMutationResult,
} from "@/app/(authentication)/_lib/actions";

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (input: LoginFormField): Promise<AuthMutationResult> => {
      const result = await loginAction(input);
      return readSafeActionData(result, "Invalid email or password.");
    },
  });
}

export function useSignupMutation() {
  return useMutation({
    mutationFn: async (input: RegularSignupFormField): Promise<AuthMutationResult> => {
      const result = await signupAction(input);
      return readSafeActionData(result, "Please check the form and try again.");
    },
  });
}

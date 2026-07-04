"use client";

import { useMutation } from "@tanstack/react-query";

import { createClassAction } from "@/app/(root)/_lib/class-actions";
import type { CreateClassInput } from "@/app/(root)/_lib/actions.schemas";
import { readSafeActionData } from "@/lib/actions/read-safe-action-result";

export function useCreateClassMutation() {
  return useMutation({
    mutationFn: async (input: CreateClassInput) => {
      const result = await createClassAction(input);
      return readSafeActionData(result, "Please check the class details and try again.");
    },
  });
}

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateClassAction } from "@/app/(root)/_lib/class-actions";
import type { UpdateClassInput } from "@/app/(root)/_lib/actions.schemas";
import { readSafeActionData } from "@/lib/actions/read-safe-action-result";
import { queryKeys } from "@/lib/query/keys";

export function useUpdateClassMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateClassInput) => {
      const result = await updateClassAction(input);
      return readSafeActionData(result, "Please check the class details and try again.");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.classes.all });
    },
  });
}

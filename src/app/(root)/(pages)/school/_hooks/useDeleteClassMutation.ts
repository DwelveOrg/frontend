"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteClassAction } from "@/app/(root)/_lib/class-actions";
import type { DeleteClassInput } from "@/app/(root)/_lib/actions.schemas";
import { readSafeActionData } from "@/lib/actions/read-safe-action-result";
import { queryKeys } from "@/lib/query/keys";

export function useDeleteClassMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: DeleteClassInput) => {
      const result = await deleteClassAction(input);
      return readSafeActionData(result, "Could not delete the class. Please try again.");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.classes.all });
    },
  });
}

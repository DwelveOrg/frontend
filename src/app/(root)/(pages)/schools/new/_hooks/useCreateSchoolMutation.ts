"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createSchoolAction } from "@/app/(authentication)/_lib/actions";
import type { CreateSchoolFormField } from "@/app/(authentication)/_types/_schemas";
import { readSafeActionData } from "@/lib/actions/read-safe-action-result";
import { queryKeys } from "@/lib/query/keys";

export function useCreateSchoolMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateSchoolFormField) => {
      const result = await createSchoolAction(input);
      return readSafeActionData(result, "Please check the school details and try again.");
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.schools.all }),
      ]);
    },
  });
}

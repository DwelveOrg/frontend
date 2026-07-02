"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { joinSchoolAction } from "@/app/(authentication)/_lib/actions";
import type { JoinSchoolFormField } from "@/app/(authentication)/_types/_schemas";
import { readSafeActionData } from "@/lib/actions/read-safe-action-result";
import { queryKeys } from "@/lib/query/keys";

export function useJoinSchoolMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: JoinSchoolFormField) => {
      const result = await joinSchoolAction(input);
      return readSafeActionData(result, "Invalid join code. Please check and try again.");
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

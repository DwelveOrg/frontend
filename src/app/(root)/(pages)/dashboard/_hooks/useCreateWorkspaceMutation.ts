"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createWorkspaceAction } from "@/app/(authentication)/_lib/actions";
import type { CreateWorkspaceFormField } from "@/app/(authentication)/_types/_schemas";
import { readSafeActionData } from "@/lib/actions/read-safe-action-result";
import { queryKeys } from "@/lib/query/keys";

export function useCreateWorkspaceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateWorkspaceFormField) => {
      const result = await createWorkspaceAction(input);
      return readSafeActionData(result, "Please check the workspace details and try again.");
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.all }),
      ]);
    },
  });
}

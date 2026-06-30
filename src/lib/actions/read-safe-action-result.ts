type SafeActionResponse<TData> = {
  data?: TData;
  serverError?: string;
  validationErrors?: unknown;
};

export function readSafeActionData<TData>(
  result: SafeActionResponse<TData>,
  fallbackMessage: string,
) {
  if (result.serverError) {
    throw new Error(result.serverError);
  }

  if (result.validationErrors || !result.data) {
    throw new Error(fallbackMessage);
  }

  return result.data;
}

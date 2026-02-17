import { ApiErrorResponse } from "./types";

export function extractApiError(error: unknown) {
  const data: ApiErrorResponse | undefined = (error as any)?.response?.data;

  if (!data) {
    return {
      message: "Something went wrong",
      issues: [],
    };
  }

  return {
    message: data.message,
    issues: data.issues ?? [],
  };
}

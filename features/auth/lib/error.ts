import { ApiErrorResponse } from "../types";

export function extractApiError(error: any) {
  const data: ApiErrorResponse | undefined = error?.response?.data;

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

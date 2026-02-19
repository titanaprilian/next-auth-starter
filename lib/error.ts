import { ApiErrorResponse } from "./types";

export interface ApiIssue {
  field: string;
  message: string;
}

export function extractApiError(error: unknown) {
  const data: ApiErrorResponse | undefined = (error as any)?.response?.data;

  if (!data) {
    return {
      message: "Something went wrong",
      issues: [],
    };
  }

  const issues: ApiIssue[] = (data.issues ?? []).map((issue) => ({
    field: issue.field,
    message: issue.message,
  }));

  return {
    message: data.message,
    issues,
  };
}

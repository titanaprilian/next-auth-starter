export interface ApiErrorResponse {
  error: boolean;
  code: number;
  message: string;
  issues?: Array<{ field: string; message: string }>;
}

export interface ApiResponse<T> {
  error: boolean;
  code: number;
  message: string;
  data: T;
}

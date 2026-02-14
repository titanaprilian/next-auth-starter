export interface ApiErrorResponse {
  error: boolean;
  code: number;
  message: string;
  issues?: Array<{ path: string; message: string }>;
}

export interface ApiResponse<T> {
  error: boolean;
  code: number;
  message: string;
  data: T;
}

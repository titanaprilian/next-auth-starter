import { ApiErrorResponse, ApiResponse } from "@/lib/types";
import { LoginFormData } from "../schemas/loginFormSchema";

export type { ApiErrorResponse, ApiResponse };

export interface User {
  id: string;
  email: string;
  name: string;
  roleName?: string;
}

export interface AuthResponseData {
  access_token: string;
  refresh_token: string;
  user: User;
}

export type AuthResponse = ApiResponse<AuthResponseData>;

export interface AuthContextType {
  user: User | undefined;
  isLoading: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  login: (values: LoginFormData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

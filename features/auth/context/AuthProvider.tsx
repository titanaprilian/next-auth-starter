"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser, useLogin, useLogout } from "../hooks/useAuthQuery";
import { AuthContextType, AuthResponse } from "../types";
import { LoginFormData } from "../schemas/loginFormSchema";
import { AUTH_ROUTES } from "../lib/routes";
import { setAxiosToken, setRefreshSubscriber, clearLogoutState } from "@/app/utils/axios";

/**
 * Authentication context value type.
 * Provided by AuthProvider to all child components.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component that manages authentication state and provides auth methods.
 * 
 * This provider:
 * - Fetches current user on mount
 * - Provides login/logout functions
 * - Syncs token refresh with axios interceptor
 * - Clears logout state when user session is valid
 * 
 * @example
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const { data: user, isLoading } = useCurrentUser({ enabled: true });

  /**
   * Login function that:
   * 1. Calls the login mutation
   * 2. Redirects to dashboard on success
   * 3. Returns the response for error handling in the form
   */
  const login = useCallback(
    async (values: LoginFormData): Promise<AuthResponse> => {
      const response = await loginMutation.mutateAsync(values);
      router.push(AUTH_ROUTES.DASHBOARD);
      return response;
    },
    [loginMutation, router],
  );

  /**
   * Logout function that:
   * 1. Calls the logout mutation (invalidates session on server)
   * 2. Redirects to login page
   */
  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
    router.push(AUTH_ROUTES.LOGIN);
  }, [logoutMutation, router]);

  /**
   * Combined loading state for auth operations.
   * True when either login or user fetch is in progress.
   */
  const isAuthLoading = loginMutation.isPending || isLoading;

  /**
   * Context value memoized to prevent unnecessary re-renders.
   * Includes user data, loading states, and login/logout functions.
   */
  const value = useMemo(
    () => ({
      user,
      isLoading: isAuthLoading,
      isLoggingIn: loginMutation.isPending,
      isLoggingOut: logoutMutation.isPending,
      login,
      logout,
    }),
    [
      user,
      isAuthLoading,
      loginMutation.isPending,
      logoutMutation.isPending,
      login,
      logout,
    ],
  );

  /**
   * Sets up the refresh subscriber to sync new tokens with axios.
   * This allows other parts of the app to be notified when token is refreshed.
   */
  useEffect(() => {
    setRefreshSubscriber((newToken: string) => {
      setAxiosToken(newToken);
    });
  }, []);

  /**
   * Clears logout state when user session is successfully validated.
   * This happens when /me endpoint returns valid user data.
   */
  useEffect(() => {
    if (user) {
      clearLogoutState();
    }
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access authentication context.
 * 
 * @throws Error if used outside of AuthProvider
 * 
 * @example
 * const { user, login, logout } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

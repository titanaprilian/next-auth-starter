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
import { setAxiosToken, setRefreshSubscriber } from "@/app/utils/axios";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const { data: user, isLoading } = useCurrentUser({ enabled: true });

  const login = useCallback(
    async (values: LoginFormData): Promise<AuthResponse> => {
      const response = await loginMutation.mutateAsync(values);
      router.push(AUTH_ROUTES.DASHBOARD);
      return response;
    },
    [loginMutation, router],
  );

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
    router.push(AUTH_ROUTES.LOGIN);
  }, [logoutMutation, router]);

  const isAuthLoading = loginMutation.isPending || isLoading;

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

  useEffect(() => {
    setRefreshSubscriber((newToken: string) => {
      setAxiosToken(newToken);
    });
  }, []);

  useEffect(() => {
    if (user) {
      // User successfully fetched
      // This means accessToken is valid OR refresh worked
    }
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

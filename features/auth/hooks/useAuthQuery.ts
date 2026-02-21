import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginUser, logoutUser, fetchCurrentUser } from "../services/authApi";
import { AuthResponse, User } from "../types";
import { LoginFormData } from "../schemas/loginFormSchema";
import { setAxiosToken, resetAuthState, markWasLoggedIn, clearWasLoggedIn } from "@/app/utils/axios";

/**
 * Query key factory for auth-related queries.
 * Used to invalidate/clear auth queries consistently.
 */
export const authKeys = {
  currentUser: ["currentUser"] as const,
};

/**
 * Hook to fetch the current authenticated user.
 * 
 * @param enabled - Whether to enable the query (usually true when user is on protected pages)
 * 
 * @example
 * const { data: user, isLoading } = useCurrentUser({ enabled: true });
 */
export const useCurrentUser = ({ enabled }: { enabled: boolean }) => {
  return useQuery<User>({
    queryKey: authKeys.currentUser,
    queryFn: fetchCurrentUser,
    retry: false, // Don't retry on 401 - let the interceptor handle it
    enabled,
  });
};

/**
 * Hook to handle user login.
 * 
 * This mutation:
 * 1. Sends login credentials to the API
 * 2. On success: stores the access token and invalidates user query
 * 
 * @example
 * const loginMutation = useLogin();
 * loginMutation.mutate({ email: "user@test.com", password: "password" });
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: LoginFormData): Promise<AuthResponse> => {
      const response = await loginUser(values);

      const token = response.data.access_token;
      resetAuthState(); // Clear any previous logout state
      setAxiosToken(token);
      markWasLoggedIn(); // Mark user as logged in for session persistence

      return response;
    },
    onSuccess: () => {
      // Refetch user data after successful login
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser });
    },
  });
};

/**
 * Hook to handle user logout.
 * 
 * This mutation:
 * 1. Calls the logout API to invalidate the session on the server
 * 2. On success: clears the access token and all cached queries
 * 
 * @example
 * const logoutMutation = useLogout();
 * logoutMutation.mutate();
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await logoutUser();
    },
    onSuccess: () => {
      setAxiosToken(null);
      clearWasLoggedIn();
      // Clear all cached queries to prevent stale data
      queryClient.clear();
    },
  });
};

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginUser, logoutUser, fetchCurrentUser } from "../services/authApi";
import { AuthResponse, User } from "../types";
import { LoginFormData } from "../schemas/loginFormSchema";
import { setAxiosToken } from "@/app/utils/axios";

export const authKeys = {
  currentUser: ["currentUser"] as const,
};

export const useCurrentUser = ({ enabled }: { enabled: boolean }) => {
  return useQuery<User>({
    queryKey: authKeys.currentUser,
    queryFn: fetchCurrentUser,
    retry: false,
    enabled,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: LoginFormData): Promise<AuthResponse> => {
      const response = await loginUser(values);

      const token = response.data.access_token;
      setAxiosToken(token);

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await logoutUser();
    },
    onSuccess: () => {
      setAxiosToken(null);
      queryClient.clear();
    },
  });
};

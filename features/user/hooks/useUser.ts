"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUser,
  deleteUser,
  fetchRoles,
  fetchUsers,
  fetchUserById,
  updateUser,
} from "../services/userApi";
import { UserFormData } from "../schema/userFormSchema";
import { User, UserFilters, UsersResponse, ApiRolesResponse } from "../types";

/**
 * Query key factory for user-related queries.
 * Used for cache management and query invalidation.
 */
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: Partial<UserFilters>) =>
    [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

/**
 * Query key factory for role-related queries.
 * Used for cache management and query invalidation.
 */
export const roleKeys = {
  all: ["roles"] as const,
  lists: () => [...roleKeys.all, "list"] as const,
  list: () => [...roleKeys.lists()],
};

/**
 * Custom hook to fetch users with optional filtering.
 *
 * @param filters - Partial filter object containing search, role, page, and limit
 * @returns Query result object containing users data, loading state, and error
 *
 * @example
 * const { data, isLoading, error } = useFetchUser({ search: "john", role: "admin", page: 1, limit: 10 });
 */
export function useFetchUser(filters: Partial<UserFilters>) {
  return useQuery<UsersResponse>({
    queryKey: userKeys.list(filters),
    queryFn: () => fetchUsers(filters),
  });
}

/**
 * Custom hook to create a new user.
 *
 * @returns Mutation object with mutate function and state properties (isPending, isSuccess, isError)
 *
 * @example
 * const createUser = useCreateUser();
 * createUser.mutate({ name: "John", email: "john@example.com", role: "admin" });
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UserFormData): Promise<User> => {
      return createUser(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

/**
 * Custom hook to update an existing user.
 *
 * @returns Mutation object with mutate function and state properties (isPending, isSuccess, isError)
 *
 * @example
 * const updateUser = useUpdateUser();
 * updateUser.mutate({ id: "123", data: { name: "John Updated", email: "john@example.com", role: "admin" } });
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UserFormData;
    }): Promise<User> => {
      return updateUser(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

/**
 * Custom hook to delete a user.
 *
 * @returns Mutation object with mutate, mutateAsync functions and state properties (isPending, isSuccess, isError)
 *
 * @example
 * const deleteUser = useDeleteUser();
 * deleteUser.mutate("123");
 *
 * @example
 * // Async usage
 * const deleteUser = useDeleteUser();
 * await deleteUser.mutateAsync("123");
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

/**
 * Custom hook to fetch all available roles.
 *
 * @returns Query result object containing roles data, loading state, and error
 *
 * @example
 * const { data, isLoading, error } = useFetchRole();
 */
export function useFetchRole() {
  return useQuery<ApiRolesResponse>({
    queryKey: roleKeys.list(),
    queryFn: fetchRoles,
  });
}

/**
 * Custom hook to fetch a user by ID.
 *
 * @param id - User ID to fetch
 * @returns Query result object containing user data, loading state, and error
 *
 * @example
 * const { data, isLoading, error } = useFetchUserById("123");
 */
export function useFetchUserById(id: string | null) {
  return useQuery<User>({
    queryKey: userKeys.detail(id || ""),
    queryFn: () => fetchUserById(id!),
    enabled: !!id,
  });
}

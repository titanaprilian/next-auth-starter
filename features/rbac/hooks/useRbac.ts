"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRole,
  deleteRole,
  fetchFeatures,
  fetchMyPermissions,
  fetchRoleById,
  fetchRoleOptions,
  fetchRoles,
  updateRole,
} from "../services/rbacApi";
import {
  Role,
  RoleFilters,
  RolesResponse,
  RoleFormData,
  ApiRoleOptionsResponse,
  MyPermissions,
  FeaturesResponse,
} from "../types";

export const roleKeys = {
  all: ["roles"] as const,
  lists: () => [...roleKeys.all, "list"] as const,
  list: (filters: Partial<RoleFilters>) =>
    [...roleKeys.lists(), filters] as const,
  details: () => [...roleKeys.all, "detail"] as const,
  detail: (id: string) => [...roleKeys.details(), id] as const,
  options: () => [...roleKeys.all, "options"] as const,
};

export const featureKeys = {
  all: ["features"] as const,
  lists: () => [...featureKeys.all, "list"] as const,
  list: (filters: Partial<RoleFilters>) =>
    [...featureKeys.lists(), filters] as const,
};

export const permissionKeys = {
  all: ["permissions"] as const,
  me: () => [...permissionKeys.all, "me"] as const,
};

export function useRoles(filters: Partial<RoleFilters>) {
  return useQuery<RolesResponse>({
    queryKey: roleKeys.list(filters),
    queryFn: () => fetchRoles(filters),
  });
}

export function useRoleById(id: string | null) {
  return useQuery<Role>({
    queryKey: roleKeys.detail(id || ""),
    queryFn: () => fetchRoleById(id!),
    enabled: !!id,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: RoleFormData,
    ): Promise<{ role: Role; message: string }> => {
      return createRole(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: RoleFormData;
    }): Promise<{ role: Role; message: string }> => {
      return updateRole(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
    },
  });
}

export function useRoleOptions() {
  return useQuery<ApiRoleOptionsResponse>({
    queryKey: roleKeys.options(),
    queryFn: fetchRoleOptions,
  });
}

export function useMyPermissions({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery<MyPermissions>({
    queryKey: permissionKeys.me(),
    queryFn: fetchMyPermissions,
    enabled,
  });
}

export function useFeatures(filters: Partial<RoleFilters>) {
  return useQuery<FeaturesResponse>({
    queryKey: featureKeys.list(filters),
    queryFn: () => fetchFeatures(filters),
  });
}

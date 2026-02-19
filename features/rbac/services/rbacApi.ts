import { ApiAxios } from "@utils/axios";
import {
  Role,
  RoleFormData,
  RoleFilters,
  MyPermissions,
  DeleteResponse,
  ApiRolesResponse,
  ApiRoleOptionsResponse,
  ApiRoleResponse,
  ApiDeleteRoleResponse,
  ApiFeaturesResponse,
  ApiMyPermissionsResponse,
  RolesResponse,
  FeaturesResponse,
} from "../types";

export async function fetchRoles(
  filters: Partial<RoleFilters>
): Promise<RolesResponse> {
  const params: Record<string, string | number> = {};
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  if (filters.search) params.search = filters.search;

  const { data } = await ApiAxios.get<ApiRolesResponse>("/rbac/roles", {
    params,
  });

  return {
    data: data.data,
    pagination: {
      page: data.pagination.page,
      limit: data.pagination.limit,
      total: data.pagination.total,
      totalPages: data.pagination.totalPages,
    },
  };
}

export async function fetchRoleById(id: string): Promise<Role> {
  const { data } = await ApiAxios.get<ApiRoleResponse>(`/rbac/roles/${id}`);
  return data.data;
}

export async function createRole(data: RoleFormData): Promise<Role> {
  const { data: result } = await ApiAxios.post<ApiRoleResponse>("/rbac/roles", {
    name: data.name,
    description: data.description,
    permissions: data.permissions,
  });

  return result.data;
}

export async function updateRole(
  id: string,
  data: RoleFormData
): Promise<Role> {
  const { data: result } = await ApiAxios.patch<ApiRoleResponse>(
    `/rbac/roles/${id}`,
    {
      name: data.name,
      description: data.description,
      permissions: data.permissions,
    }
  );

  return result.data;
}

export async function deleteRole(id: string): Promise<DeleteResponse> {
  const { data } = await ApiAxios.delete<ApiDeleteRoleResponse>(`/rbac/roles/${id}`);

  return {
    success: !data.error,
    message: data.message,
  };
}

export async function fetchRoleOptions(): Promise<ApiRoleOptionsResponse> {
  const { data } = await ApiAxios.get<ApiRoleOptionsResponse>("/rbac/roles/options");
  return data;
}

export async function fetchMyPermissions(): Promise<MyPermissions> {
  const { data } = await ApiAxios.get<ApiMyPermissionsResponse>("/rbac/roles/me");
  return data.data;
}

export async function fetchFeatures(
  filters: Partial<RoleFilters>
): Promise<FeaturesResponse> {
  const params: Record<string, string | number> = {};
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  if (filters.search) params.search = filters.search;

  const { data } = await ApiAxios.get<ApiFeaturesResponse>("/rbac/features", {
    params,
  });

  return {
    data: data.data,
    pagination: {
      page: data.pagination.page,
      limit: data.pagination.limit,
      total: data.pagination.total,
      totalPages: data.pagination.totalPages,
    },
  };
}

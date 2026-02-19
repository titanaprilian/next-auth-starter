import { ApiErrorResponse } from "@/lib/types";

export type { ApiErrorResponse };

export interface Feature {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionFeature {
  id: string;
  name: string;
}

export interface RolePermission {
  featureId: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canPrint: boolean;
  feature?: PermissionFeature;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: RolePermission[];
  createdAt: string;
  updatedAt: string;
}

export interface RoleOption {
  id: string;
  name: string;
}

export interface RoleListItem {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface MyPermission {
  featureId: string;
  featureName: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canPrint: boolean;
}

export interface MyPermissions {
  roleName: string;
  permissions: MyPermission[];
}

export interface RoleFilters {
  search: string;
  page: number;
  limit: number;
}

export interface PermissionInput {
  featureId: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canPrint: boolean;
}

export interface RoleFormData {
  name: string;
  description: string;
  permissions: PermissionInput[];
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

export interface ApiRolesResponse extends ApiErrorResponse {
  data: RoleListItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiRoleOptionsResponse extends ApiErrorResponse {
  data: RoleOption[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiRoleResponse extends ApiErrorResponse {
  data: Role;
}

export interface ApiDeleteRoleResponse extends ApiErrorResponse {
  data: RoleListItem;
}

export interface ApiFeaturesResponse extends ApiErrorResponse {
  data: Feature[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiMyPermissionsResponse extends ApiErrorResponse {
  data: MyPermissions;
}

export interface RolesResponse {
  data: RoleListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FeaturesResponse {
  data: Feature[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type RoleDialogMode = "add" | "edit" | "view";

export interface RoleDialogState {
  isOpen: boolean;
  mode: RoleDialogMode;
  selectedRole: Role | null;
}

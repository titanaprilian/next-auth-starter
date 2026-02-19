"use client";

import { toast } from "sonner";
import { useRoleFilters } from "./useRoleFilters";
import { useRoleDialog } from "./useRoleDialog";
import { useDeleteRoleDialog } from "./useDeleteRoleDialog";
import { RoleFormData } from "../schema/roleFormSchema";
import { extractApiError } from "@/lib/error";
import {
  useRoles,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from "./useRbac";

export function useRoleManagement() {
  const filters = useRoleFilters();
  const rolesQuery = useRoles({
    search: filters.debouncedSearch,
    page: filters.page,
    limit: filters.limit,
  });
  const deleteRole = useDeleteRole();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const dialog = useRoleDialog();
  const deleteDialog = useDeleteRoleDialog();

  const handleDeleteRole = (roleId: string) => {
    deleteRole.mutate(roleId, {
      onSuccess: () => {
        deleteDialog.close();
        toast.success("Role deleted successfully");
      },
      onError: (error) => {
        const { message } = extractApiError(error);
        toast.error(message || "Failed to delete role");
      },
    });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.selectedRole) {
      handleDeleteRole(deleteDialog.selectedRole.id);
    }
  };

  const handleCreateRole = (data: RoleFormData) => {
    createRole.mutate(data, {
      onSuccess: () => {
        dialog.close();
        toast.success("Role created successfully");
      },
      onError: (error) => {
        const { message, issues } = extractApiError(error);
        if (issues.length > 0) {
          issues.forEach((issue) => {
            toast.error(`${issue.field}: ${issue.message}`);
          });
        } else {
          toast.error(message || "Failed to create role");
        }
      },
    });
  };

  const handleUpdateRole = (data: RoleFormData) => {
    if (!dialog.selectedRole) return;
    updateRole.mutate(
      { id: dialog.selectedRole.id, data },
      {
        onSuccess: () => {
          dialog.close();
          toast.success("Role updated successfully");
        },
        onError: (error) => {
          const { message, issues } = extractApiError(error);
          if (issues.length > 0) {
            issues.forEach((issue) => {
              toast.error(`${issue.field}: ${issue.message}`);
            });
          } else {
            toast.error(message || "Failed to update role");
          }
        },
      },
    );
  };

  const handleSubmit = (data: RoleFormData) => {
    if (dialog.mode === "add") {
      handleCreateRole(data);
    } else {
      handleUpdateRole(data);
    }
  };

  return {
    filters,
    roles: rolesQuery.data?.data,
    pagination: rolesQuery.data?.pagination,
    rolesLoading: rolesQuery.isLoading,
    rolesError: rolesQuery.error,
    refetchRoles: rolesQuery.refetch,
    deleteRole: deleteDialog.openDelete,
    handleDeleteRole: handleDeleteRole,
    deleteRoleAsync: deleteRole.mutateAsync,
    deleteRoleLoading: deleteRole.isPending,
    deleteRoleSuccess: deleteRole.isSuccess,
    deleteRoleError: deleteRole.isError,
    createRoleLoading: createRole.isPending,
    updateRoleLoading: updateRole.isPending,
    dialog,
    deleteDialog,
    handleSubmit,
    handleConfirmDelete,
  };
}

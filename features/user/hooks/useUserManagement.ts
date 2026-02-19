"use client";

import { toast } from "sonner";
import { useUserFilters } from "./useUserFilters";
import { useUserDialog } from "./useUserDialog";
import { useDeleteDialog } from "./useDeleteDialog";
import { UserFormData } from "../schema/userFormSchema";
import { extractApiError } from "@/lib/error";
import {
  useFetchUser,
  useFetchRole,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "./useUser";

export function useUserManagement() {
  const filters = useUserFilters();
  const usersQuery = useFetchUser({
    search: filters.debouncedSearch,
    role: filters.role,
    page: filters.page,
    limit: filters.limit,
  });
  const rolesQuery = useFetchRole();
  const deleteUser = useDeleteUser();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const dialog = useUserDialog();
  const deleteDialog = useDeleteDialog();

  const handleDeleteUser = (userId: string) => {
    deleteUser.mutate(userId, {
      onSuccess: () => {
        deleteDialog.close();
        toast.success("User deleted successfully");
      },
      onError: (error) => {
        const { message } = extractApiError(error);
        toast.error(message || "Failed to delete user");
      },
    });
  };

  const handleCreateUser = (data: UserFormData) => {
    createUser.mutate(data, {
      onSuccess: () => {
        dialog.close();
        toast.success("User created successfully");
      },
      onError: (error) => {
        const { message, issues } = extractApiError(error);
        if (issues.length > 0) {
          issues.forEach((issue) => {
            toast.error(`${issue.field}: ${issue.message}`);
          });
        } else {
          toast.error(message || "Failed to create user");
        }
      },
    });
  };

  const handleUpdateUser = (data: UserFormData) => {
    if (!dialog.selectedUser) return;
    updateUser.mutate(
      { id: dialog.selectedUser.id, data },
      {
        onSuccess: () => {
          dialog.close();
          toast.success("User updated successfully");
        },
        onError: (error) => {
          const { message, issues } = extractApiError(error);
          if (issues.length > 0) {
            issues.forEach((issue) => {
              toast.error(`${issue.field}: ${issue.message}`);
            });
          } else {
            toast.error(message || "Failed to update user");
          }
        },
      },
    );
  };

  const handleSubmit = (data: UserFormData) => {
    if (dialog.mode === "add") {
      handleCreateUser(data);
    } else {
      handleUpdateUser(data);
    }
  };

  return {
    filters,
    users: usersQuery.data?.data,
    pagination: usersQuery.data?.pagination,
    roles: rolesQuery.data?.data,
    rolesLoading: rolesQuery.isLoading,
    usersLoading: usersQuery.isLoading,
    usersError: usersQuery.error,
    refetchUsers: usersQuery.refetch,
    deleteUser: deleteDialog.openDelete,
    handleDeleteUser: handleDeleteUser,
    deleteUserAsync: deleteUser.mutateAsync,
    deleteUserLoading: deleteUser.isPending,
    deleteUserSuccess: deleteUser.isSuccess,
    deleteUserError: deleteUser.isError,
    createUserLoading: createUser.isPending,
    updateUserLoading: updateUser.isPending,
    dialog,
    deleteDialog,
    handleSubmit,
  };
}

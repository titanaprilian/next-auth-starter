"use client";

import { Suspense } from "react";
import {
  UserFilters,
  UserManagementHeader,
  useUserManagement,
  UsersTable,
  UserDialog,
  DeleteUserDialog,
} from "@/features/user";
import { useUserPermissions } from "@/features/rbac";
import { Skeleton } from "@/components/ui/skeleton";

function UsersContent() {
  const {
    filters,
    users,
    pagination,
    usersLoading,
    roles,
    rolesLoading,
    deleteUser,
    handleDeleteUser,
    dialog,
    deleteDialog,
    handleSubmit,
    createUserLoading,
    updateUserLoading,
    deleteUserLoading,
  } = useUserManagement();

  const permissions = useUserPermissions();

  return (
    <div className="space-y-6">
      <UserManagementHeader
        onAddUser={dialog.openAdd}
        canCreate={permissions.canCreate}
      />
      <UserFilters
        search={filters.search}
        role={filters.role}
        roles={roles}
        isLoadingRoles={rolesLoading}
        onSearchChange={filters.setSearch}
        onRoleChange={filters.setRole}
      />
      <UsersTable
        data={users || []}
        isLoading={usersLoading}
        page={pagination?.page || 1}
        limit={pagination?.limit || 10}
        total={pagination?.total || 0}
        onPageChange={filters.setPage}
        onLimitChange={filters.setLimit}
        onView={dialog.openView}
        onEdit={dialog.openEdit}
        onDelete={deleteUser}
        permissions={permissions}
      />
      <UserDialog
        isOpen={dialog.isOpen}
        mode={dialog.mode}
        selectedUser={dialog.selectedUser}
        onClose={dialog.close}
        onSubmit={handleSubmit}
        isLoading={createUserLoading || updateUserLoading}
      />
      <DeleteUserDialog
        user={deleteDialog.selectedUser}
        isOpen={deleteDialog.isOpen}
        isLoading={deleteUserLoading}
        onClose={deleteDialog.close}
        onConfirm={() => {
          if (deleteDialog.selectedUser) {
            handleDeleteUser(deleteDialog.selectedUser.id);
          }
        }}
      />
    </div>
  );
}

function UsersLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-14 w-[300px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-[400px] w-full" />
    </div>
  );
}

export default function UsersPage() {
  return (
    <Suspense fallback={<UsersLoading />}>
      <UsersContent />
    </Suspense>
  );
}

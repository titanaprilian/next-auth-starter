"use client";

import { Suspense } from "react";
import {
  RoleFilters,
  RoleManagementHeader,
  useRoleManagement,
  RolesTable,
  RoleDialog,
  DeleteRoleDialog,
} from "@/features/rbac";
import { Skeleton } from "@/components/ui/skeleton";

function RolesContent() {
  const {
    filters,
    roles,
    pagination,
    rolesLoading,
    deleteRole,
    dialog,
    deleteDialog,
    handleSubmit,
    handleConfirmDelete,
    createRoleLoading,
    updateRoleLoading,
    deleteRoleLoading,
  } = useRoleManagement();

  return (
    <div className="space-y-6">
      <RoleManagementHeader onAddRole={dialog.openAdd} />
      <RoleFilters
        search={filters.search}
        onSearchChange={filters.setSearch}
      />
      <RolesTable
        data={roles || []}
        isLoading={rolesLoading}
        page={pagination?.page || 1}
        limit={pagination?.limit || 10}
        total={pagination?.total || 0}
        onPageChange={filters.setPage}
        onLimitChange={filters.setLimit}
        onView={(role) => dialog.openView(role)}
        onEdit={(role) => dialog.openEdit(role)}
        onDelete={deleteRole}
      />
      <RoleDialog
        isOpen={dialog.isOpen}
        mode={dialog.mode}
        selectedRole={dialog.selectedRole}
        onClose={dialog.close}
        onSubmit={handleSubmit}
        isLoading={createRoleLoading || updateRoleLoading}
      />
      <DeleteRoleDialog
        role={deleteDialog.selectedRole}
        isOpen={deleteDialog.isOpen}
        isLoading={deleteRoleLoading}
        onClose={deleteDialog.close}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

function RolesLoading() {
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

export default function RolesPage() {
  return (
    <Suspense fallback={<RolesLoading />}>
      <RolesContent />
    </Suspense>
  );
}

"use client";

import { useMemo } from "react";
import { usePermissions } from "../context/PermissionsProvider";

/**
 * Hook to get permission checks for a specific feature.
 * Useful for tables and forms that need to conditionally render action buttons.
 * 
 * @param feature - The feature name (e.g., "user_management", "RBAC_management")
 * @returns Object with all permission booleans for the feature
 * 
 * @example
 * // In a table component
 * const permissions = useFeaturePermissions("user_management");
 * 
 * // Conditionally render buttons
 * {permissions.canCreate && <Button>Add User</Button>}
 * {permissions.canUpdate && <Button>Edit</Button>}
 * {permissions.canDelete && <Button>Delete</Button>}
 * {permissions.canView && <Button>View</Button>}
 */
export function useFeaturePermissions(feature: string) {
  const { canRead, canCreate, canUpdate, canDelete, canPrint, isLoading } =
    usePermissions();

  return useMemo(
    () => ({
      canRead: canRead(feature),
      canCreate: canCreate(feature),
      canUpdate: canUpdate(feature),
      canDelete: canDelete(feature),
      canPrint: canPrint(feature),
      isLoading,
    }),
    [feature, canRead, canCreate, canUpdate, canDelete, canPrint, isLoading]
  );
}

/**
 * Hook specifically for user management permissions
 */
export function useUserPermissions() {
  return useFeaturePermissions("user_management");
}

/**
 * Hook specifically for RBAC management permissions
 */
export function useRBACPermissions() {
  return useFeaturePermissions("RBAC_management");
}

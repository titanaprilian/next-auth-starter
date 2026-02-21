"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useMemo,
} from "react";
import { useMyPermissions } from "../hooks/useRbac";
import { MyPermission, MyPermissions } from "../types";
import { hasValidSession } from "@/app/utils/axios";

/**
 * Permission check options
 */
export interface PermissionCheckOptions {
  feature: string;
  action: "create" | "read" | "update" | "delete" | "print";
}

/**
 * Permissions context value type
 */
interface PermissionsContextType {
  permissions: MyPermission[];
  roleName: string;
  isLoading: boolean;
  hasPermission: (options: PermissionCheckOptions) => boolean;
  canRead: (feature: string) => boolean;
  canCreate: (feature: string) => boolean;
  canUpdate: (feature: string) => boolean;
  canDelete: (feature: string) => boolean;
  canPrint: (feature: string) => boolean;
  /**
   * Get all permission checks for a specific feature
   * Useful for tables and forms
   */
  getFeaturePermissions: (feature: string) => {
    canRead: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canPrint: boolean;
  };
}

/**
 * Permissions context
 */
const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

/**
 * Feature name mappings for sidebar menu items
 */
export const FEATURE_MAPPINGS = {
  dashboard: "dashboard",
  user_management: "user_management",
  rbac_management: "RBAC_management",
} as const;

export type FeatureName = keyof typeof FEATURE_MAPPINGS;
export type FeatureValue = (typeof FEATURE_MAPPINGS)[FeatureName];

/**
 * PermissionsProvider component that manages user permissions state.
 * 
 * This provider:
 * - Fetches current user's permissions on mount
 * - Provides permission checking functions
 * - Maps feature names to backend feature identifiers
 * 
 * @example
 * <PermissionsProvider>
 *   <App />
 * </PermissionsProvider>
 */
export function PermissionsProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useMyPermissions({ enabled: hasValidSession() });

  const permissionsData: MyPermissions = useMemo(() => {
    return data || { roleName: "", permissions: [] };
  }, [data]);

  /**
   * Check if user has a specific permission
   */
  const hasPermission = useMemo(() => {
    return ({ feature, action }: PermissionCheckOptions): boolean => {
      const permission = permissionsData.permissions.find(
        (p) => p.featureName === feature
      );

      if (!permission) return false;

      switch (action) {
        case "create":
          return permission.canCreate;
        case "read":
          return permission.canRead;
        case "update":
          return permission.canUpdate;
        case "delete":
          return permission.canDelete;
        case "print":
          return permission.canPrint;
        default:
          return false;
      }
    };
  }, [permissionsData.permissions]);

  /**
   * Check if user can read a feature
   */
  const canRead = useMemo(() => {
    return (feature: string): boolean => {
      return hasPermission({ feature, action: "read" });
    };
  }, [hasPermission]);

  /**
   * Check if user can create in a feature
   */
  const canCreate = useMemo(() => {
    return (feature: string): boolean => {
      return hasPermission({ feature, action: "create" });
    };
  }, [hasPermission]);

  /**
   * Check if user can update in a feature
   */
  const canUpdate = useMemo(() => {
    return (feature: string): boolean => {
      return hasPermission({ feature, action: "update" });
    };
  }, [hasPermission]);

  /**
   * Check if user can delete in a feature
   */
  const canDelete = useMemo(() => {
    return (feature: string): boolean => {
      return hasPermission({ feature, action: "delete" });
    };
  }, [hasPermission]);

  /**
   * Check if user can print in a feature
   */
  const canPrint = useMemo(() => {
    return (feature: string): boolean => {
      return hasPermission({ feature, action: "print" });
    };
  }, [hasPermission]);

  /**
   * Get all permission checks for a specific feature
   */
  const getFeaturePermissions = useMemo(() => {
    return (feature: string) => {
      return {
        canRead: canRead(feature),
        canCreate: canCreate(feature),
        canUpdate: canUpdate(feature),
        canDelete: canDelete(feature),
        canPrint: canPrint(feature),
      };
    };
  }, [canRead, canCreate, canUpdate, canDelete, canPrint]);

  const value = useMemo(
    () => ({
      permissions: permissionsData.permissions,
      roleName: permissionsData.roleName,
      isLoading,
      hasPermission,
      canRead,
      canCreate,
      canUpdate,
      canDelete,
      canPrint,
      getFeaturePermissions,
    }),
    [
      permissionsData.permissions,
      permissionsData.roleName,
      isLoading,
      hasPermission,
      canRead,
      canCreate,
      canUpdate,
      canDelete,
      canPrint,
      getFeaturePermissions,
    ]
  );

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
}

/**
 * Hook to access permissions context.
 * 
 * @throws Error if used outside of PermissionsProvider
 * 
 * @example
 * const { canRead, canCreate } = usePermissions();
 * const hasUserRead = canRead("user_management");
 */
export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
}

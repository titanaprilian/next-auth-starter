"use client";

import { useState, useCallback } from "react";
import { RoleListItem } from "../types";

export const useDeleteRoleDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleListItem | null>(null);

  const openDelete = useCallback((role: RoleListItem) => {
    setSelectedRole(role);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setSelectedRole(null);
  }, []);

  return {
    isOpen,
    selectedRole,
    openDelete,
    close,
  };
};

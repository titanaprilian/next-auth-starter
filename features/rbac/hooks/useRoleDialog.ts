"use client";

import { useState, useCallback, useMemo } from "react";
import { Role, RoleDialogMode } from "../types";

export const useRoleDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<RoleDialogMode>("add");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const openAdd = useCallback(() => {
    setMode("add");
    setSelectedRole(null);
    setIsOpen(true);
  }, []);

  const openEdit = useCallback((role: Role) => {
    setMode("edit");
    setSelectedRole(role);
    setIsOpen(true);
  }, []);

  const openView = useCallback((role: Role) => {
    setMode("view");
    setSelectedRole(role);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setSelectedRole(null), 200);
  }, []);

  const title = useMemo(() => {
    switch (mode) {
      case "add":
        return "Add Role";
      case "edit":
        return "Edit Role";
      case "view":
        return "Role Details";
      default:
        return "";
    }
  }, [mode]);

  return {
    isOpen,
    mode,
    selectedRole,
    title,
    openAdd,
    openEdit,
    openView,
    close,
  };
};

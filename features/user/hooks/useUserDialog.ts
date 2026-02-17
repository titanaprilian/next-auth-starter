"use client";

import { useState, useCallback, useMemo } from "react";
import { User, UserDialogMode } from "../types";

export const useUserDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<UserDialogMode>("add");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const openAdd = useCallback(() => {
    setMode("add");
    setSelectedUser(null);
    setIsOpen(true);
  }, []);

  const openEdit = useCallback((user: User) => {
    setMode("edit");
    setSelectedUser(user);
    setIsOpen(true);
  }, []);

  const openView = useCallback((user: User) => {
    setMode("view");
    setSelectedUser(user);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setSelectedUser(null), 200);
  }, []);

  const openFilter = useCallback(() => {
    setIsFilterVisible(true);
  }, []);

  const closeFilter = useCallback(() => {
    setIsFilterVisible(false);
  }, []);

  const title = useMemo(() => {
    switch (mode) {
      case "add":
        return "Tambah User";
      case "edit":
        return "Edit User";
      case "view":
        return "Detail User";
      default:
        return "";
    }
  }, [mode]);

  const formData = useMemo(
    () => ({
      email: selectedUser?.email ?? "",
      role: selectedUser?.roleId ?? "",
      password: "",
    }),
    [selectedUser],
  );

  return {
    isOpen,
    mode,
    selectedUser,
    title,
    formData,
    openAdd,
    openEdit,
    openView,
    close,
    isFilterVisible,
    openFilter,
    closeFilter,
  };
};

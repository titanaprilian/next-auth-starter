"use client";

import { useState, useCallback } from "react";
import { User } from "../types";

export const useDeleteDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const openDelete = useCallback((user: User) => {
    setSelectedUser(user);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setSelectedUser(null);
  }, []);

  return {
    isOpen,
    selectedUser,
    openDelete,
    close,
  };
};

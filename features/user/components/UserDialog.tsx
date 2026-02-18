"use client";

import { useTranslations } from "@/lib/i18n/useTranslation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { UserForm } from "./UserForm";
import { UserView } from "./UserView";
import { User, UserDialogMode } from "../types";
import { UserFormData } from "../schema/userFormSchema";
import { useFetchRole } from "../hooks/useUser";
import { userManagementConfig } from "../config/userManagement";

interface UserDialogProps {
  isOpen: boolean;
  mode: UserDialogMode;
  selectedUser: User | null;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  isLoading?: boolean;
}

export function UserDialog({
  isOpen,
  mode,
  selectedUser,
  onClose,
  onSubmit,
  isLoading,
}: UserDialogProps) {
  const t = useTranslations();
  const { data: rolesData, isLoading: rolesLoading } = useFetchRole();

  const defaultValues: UserFormData | undefined = selectedUser
    ? {
        name: selectedUser.name,
        email: selectedUser.email,
        roleId: selectedUser.roleId as UserFormData["roleId"],
        status: selectedUser.isActive ? "active" : "inactive",
      }
    : undefined;

  const dialogConfig = userManagementConfig.dialog[mode];
  const Icon = dialogConfig.icon;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-branding-dark">
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg">
                {t(dialogConfig.titleKey)}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {t(dialogConfig.descriptionKey)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {mode === "view" && selectedUser ? (
          <UserView user={selectedUser} roles={rolesData?.data} />
        ) : (
          <UserForm
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            isLoading={isLoading}
            roles={rolesData?.data}
            isLoadingRoles={rolesLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

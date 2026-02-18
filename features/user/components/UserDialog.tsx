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
import { useFetchRole, useFetchUserById } from "../hooks/useUser";
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
  
  const { data: userData, isLoading: userLoading } = useFetchUserById(
    (mode === "view" || mode === "edit") && selectedUser ? selectedUser.id : null
  );

  const user = (mode === "view" || mode === "edit") && userData ? userData : selectedUser;

  const defaultValues: UserFormData | undefined = user
    ? {
        name: user.name,
        email: user.email,
        roleId: user.roleId as UserFormData["roleId"],
        status: user.isActive ? "active" : "inactive",
      }
    : undefined;

  const dialogConfig = userManagementConfig.dialog[mode];
  const Icon = dialogConfig.icon;

  const isViewLoading = mode === "view" && userLoading;
  const isEditLoading = mode === "edit" && userLoading;

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

        {mode === "view" ? (
          <UserView 
            user={user} 
            roles={rolesData?.data} 
            isLoading={isViewLoading} 
          />
        ) : (
          <UserForm
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            isLoading={isLoading || isEditLoading}
            roles={rolesData?.data}
            isLoadingRoles={rolesLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

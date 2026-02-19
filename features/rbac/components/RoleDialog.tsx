"use client";

import { useTranslations } from "@/lib/i18n/useTranslation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RoleForm } from "./RoleForm";
import { RoleView } from "./RoleView";
import { Role, RoleDialogMode, RoleFormData } from "../types";
import { useRoleById, useFeatures } from "../hooks/useRbac";
import { roleManagementConfig } from "../config/roleManagement";

interface RoleDialogProps {
  isOpen: boolean;
  mode: RoleDialogMode;
  selectedRole: Role | null;
  onClose: () => void;
  onSubmit: (data: RoleFormData) => void;
  isLoading?: boolean;
}

export function RoleDialog({
  isOpen,
  mode,
  selectedRole,
  onClose,
  onSubmit,
  isLoading,
}: RoleDialogProps) {
  const t = useTranslations();
  const { data: featuresData, isLoading: featuresLoading } = useFeatures({});

  const { data: roleData, isLoading: roleLoading } = useRoleById(
    (mode === "view" || mode === "edit") && selectedRole
      ? selectedRole.id
      : null,
  );

  const dialogConfig = roleManagementConfig.dialog[mode];
  const Icon = dialogConfig.icon;

  const isViewLoading = mode === "view" && roleLoading;
  const isEditLoading = mode === "edit" && roleLoading;
  const isFormLoading = isLoading || isEditLoading;

  const defaultValues: RoleFormData | undefined = roleData
    ? {
        name: roleData.name,
        description: roleData.description || "",
        permissions:
          roleData.permissions?.map((p) => ({
            featureId: p.featureId,
            canCreate: p.canCreate,
            canRead: p.canRead,
            canUpdate: p.canUpdate,
            canDelete: p.canDelete,
            canPrint: p.canPrint,
          })) || [],
      }
    : mode === "edit" && roleLoading
      ? undefined
      : selectedRole
        ? {
            name: selectedRole.name,
            description: selectedRole.description || "",
            permissions:
              selectedRole.permissions?.map((p) => ({
                featureId: p.featureId,
                canCreate: p.canCreate,
                canRead: p.canRead,
                canUpdate: p.canUpdate,
                canDelete: p.canDelete,
                canPrint: p.canPrint,
              })) || [],
          }
        : { name: "", description: "", permissions: [] };

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
          <RoleView
            role={roleData || selectedRole}
            features={featuresData?.data}
            isLoading={isViewLoading}
          />
        ) : (
          <RoleForm
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            isLoading={isFormLoading}
            features={featuresData?.data || []}
            isLoadingFeatures={featuresLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useTranslations } from "@/lib/i18n/useTranslation";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { RoleListItem } from "../types";
import { roleManagementConfig } from "../config/roleManagement";

interface DeleteRoleDialogProps {
  role: RoleListItem | null;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteRoleDialog({
  role,
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}: DeleteRoleDialogProps) {
  const t = useTranslations();
  const deleteConfig = roleManagementConfig.delete;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-7 w-7 text-red-600" />
            </div>
          </div>
          <div className="text-center">
            <DialogTitle className="text-lg">
              {t(deleteConfig.titleKey)}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {t(deleteConfig.descriptionKey)}
            </DialogDescription>
          </div>
        </DialogHeader>

        {role && (
          <div className="rounded-lg border bg-muted/50 p-3">
            <p className="font-medium">{role.name}</p>
            <p className="text-sm text-muted-foreground">{role.description}</p>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                {t("common.loading")}
              </>
            ) : (
              t(deleteConfig.confirmButtonKey)
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

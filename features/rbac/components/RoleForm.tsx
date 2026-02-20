"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  roleFormSchema,
  RoleFormData,
  PermissionInput,
} from "../schema/roleFormSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Feature } from "../types";
import { roleManagementConfig } from "../config/roleManagement";
import { useTranslations } from "@/lib/i18n/useTranslation";
import { Settings2, Check } from "lucide-react";

interface RoleFormProps {
  defaultValues?: RoleFormData;
  onSubmit: (data: RoleFormData) => void;
  isLoading?: boolean;
  features?: Feature[];
  isLoadingFeatures?: boolean;
}

const PERMISSION_ACTIONS = [
  "canCreate",
  "canRead",
  "canUpdate",
  "canDelete",
  "canPrint",
] as const;

export function RoleForm({
  defaultValues,
  onSubmit,
  isLoading,
  features = [],
  isLoadingFeatures,
}: RoleFormProps) {
  const t = useTranslations();
  const formConfig = roleManagementConfig.form;
  const isSubmittingRef = useRef(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);

  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: defaultValues || {
      name: "",
      description: "",
      permissions: [],
    },
  });

  const watchedPermissions = form.watch("permissions") || [];

  const isFeatureFullyEnabled = (featureId: string) => {
    const permission = watchedPermissions.find(
      (p) => p.featureId === featureId,
    );
    if (!permission) return false;
    return PERMISSION_ACTIONS.every((action) => permission[action] === true);
  };

  const toggleFeature = (featureId: string) => {
    const currentPermissions = form.getValues("permissions") || [];
    const existingIndex = currentPermissions.findIndex(
      (p) => p.featureId === featureId,
    );
    const isCurrentlyFull = isFeatureFullyEnabled(featureId);

    const updated = [...currentPermissions];

    if (isCurrentlyFull) {
      if (existingIndex >= 0) {
        updated.splice(existingIndex, 1);
      }
    } else {
      const newPermission: PermissionInput = {
        featureId,
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
        canPrint: true,
      };
      if (existingIndex >= 0) {
        updated[existingIndex] = newPermission;
      } else {
        updated.push(newPermission);
      }
    }
    form.setValue("permissions", updated);
  };

  const updatePermissionAction = (
    featureId: string,
    action: "canCreate" | "canRead" | "canUpdate" | "canDelete" | "canPrint",
    value: boolean,
  ) => {
    const currentPermissions = form.getValues("permissions") || [];
    const existingIndex = currentPermissions.findIndex(
      (p) => p.featureId === featureId,
    );

    if (existingIndex >= 0) {
      const updated = [...currentPermissions];
      updated[existingIndex] = {
        ...updated[existingIndex],
        [action]: value,
      };
      form.setValue("permissions", updated, { shouldDirty: true });
    } else {
      const newPermission: PermissionInput = {
        featureId,
        canCreate: action === "canCreate" ? value : false,
        canRead: action === "canRead" ? value : false,
        canUpdate: action === "canUpdate" ? value : false,
        canDelete: action === "canDelete" ? value : false,
        canPrint: action === "canPrint" ? value : false,
      };
      form.setValue("permissions", [...currentPermissions, newPermission], {
        shouldDirty: true,
      });
    }
  };

  const getPermissionValue = (
    featureId: string,
    action: "canCreate" | "canRead" | "canUpdate" | "canDelete" | "canPrint",
  ) => {
    const permission = watchedPermissions.find(
      (p) => p.featureId === featureId,
    );
    return permission?.[action] || false;
  };

  const defaultValuesRef = useRef(defaultValues);

  useEffect(() => {
    if (
      !isSubmittingRef.current &&
      defaultValues &&
      defaultValuesRef.current !== defaultValues
    ) {
      defaultValuesRef.current = defaultValues;
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  const handleSubmit = (data: RoleFormData) => {
    isSubmittingRef.current = true;
    onSubmit(data);
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="-mx-6 space-y-5 px-6"
    >
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          {t(formConfig.name.labelKey)}
        </Label>
        <Input
          id="name"
          placeholder={t(formConfig.name.placeholderKey)}
          className="h-10"
          {...form.register("name")}
          disabled={isLoading}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          {t(formConfig.description.labelKey)}
        </Label>
        <Input
          id="description"
          placeholder={t(formConfig.description.placeholderKey)}
          className="h-10"
          {...form.register("description")}
          disabled={isLoading}
        />
        {form.formState.errors.description && (
          <p className="text-sm text-destructive">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {t(formConfig.permissions.labelKey)}
        </Label>
        {isLoadingFeatures ? (
          <div className="flex items-center gap-2 py-4">
            <Spinner className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">
              {t("common.loading")}
            </span>
          </div>
        ) : features.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">
            {t("common.noResults")}
          </p>
        ) : (
          <>
            <div className="hidden md:block border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[200px]">
                      {t("role.fields.name")}
                    </TableHead>
                    <TableHead className="text-center">
                      {t("role.permission.create")}
                    </TableHead>
                    <TableHead className="text-center">
                      {t("role.permission.read")}
                    </TableHead>
                    <TableHead className="text-center">
                      {t("role.permission.update")}
                    </TableHead>
                    <TableHead className="text-center">
                      {t("role.permission.delete")}
                    </TableHead>
                    <TableHead className="text-center">
                      {t("role.permission.print")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {features.map((feature) => (
                    <TableRow key={feature.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={isFeatureFullyEnabled(feature.id)}
                            onCheckedChange={() => toggleFeature(feature.id)}
                          />
                          <span>{feature.name}</span>
                        </div>
                      </TableCell>
                      {PERMISSION_ACTIONS.map((action) => (
                        <TableCell key={action} className="text-center">
                          <Checkbox
                            checked={getPermissionValue(feature.id, action)}
                            onCheckedChange={(checked) =>
                              updatePermissionAction(
                                feature.id,
                                action,
                                checked as boolean,
                              )
                            }
                            disabled={isLoading}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="md:hidden">
              <Dialog
                open={permissionsDialogOpen}
                onOpenChange={setPermissionsDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between"
                  >
                    <span>
                      {watchedPermissions.length > 0
                        ? t(
                            watchedPermissions.length === 1
                              ? formConfig.permissions.selectedKey
                              : formConfig.permissions.selectedPluralKey,
                            { count: watchedPermissions.length },
                          )
                        : t(formConfig.permissions.placeholderKey)}
                    </span>
                    <Settings2 className="h-4 w-4 ml-2" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[90vw] max-h-[80vh] sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {t(formConfig.permissions.labelKey)}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="max-h-[60vh] overflow-y-auto space-y-3 py-2">
                    {features.map((feature) => {
                      const isFull = isFeatureFullyEnabled(feature.id);
                      return (
                        <div
                          key={feature.id}
                          className="border rounded-lg p-3 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <Checkbox
                              checked={isFull}
                              onCheckedChange={() => toggleFeature(feature.id)}
                              id={`mobile-${feature.id}`}
                            />
                            <label
                              htmlFor={`mobile-${feature.id}`}
                              className="font-medium text-sm flex-1 ml-2 cursor-pointer"
                            >
                              {feature.name}
                            </label>
                          </div>
                          <div className="grid grid-cols-5 gap-1 pt-1">
                            {PERMISSION_ACTIONS.map((action) => {
                              const actionKey = action
                                .replace("can", "")
                                .toLowerCase();
                              return (
                                <label
                                  key={action}
                                  className="flex flex-col items-center cursor-pointer"
                                >
                                  <Checkbox
                                    checked={getPermissionValue(
                                      feature.id,
                                      action,
                                    )}
                                    onCheckedChange={(checked) =>
                                      updatePermissionAction(
                                        feature.id,
                                        action,
                                        checked as boolean,
                                      )
                                    }
                                    disabled={isLoading}
                                    id={`mobile-${feature.id}-${action}`}
                                  />
                                  <span className="text-[10px] text-muted-foreground mt-0.5">
                                    {t(`role.permission.${actionKey}`)}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button
                      type="button"
                      onClick={() => setPermissionsDialogOpen(false)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      {t(formConfig.permissions.doneKey)}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </>
        )}
        {form.formState.errors.permissions && (
          <p className="text-sm text-destructive">
            {form.formState.errors.permissions.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset()}
          disabled={isLoading}
        >
          {t(formConfig.resetButton)}
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-branding-dark">
          {isLoading ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              {t(formConfig.savingText)}
            </>
          ) : (
            t(formConfig.saveButton)
          )}
        </Button>
      </div>
    </form>
  );
}

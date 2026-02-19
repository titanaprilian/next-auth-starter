"use client";

import { useEffect, useRef } from "react";
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
import { Feature } from "../types";
import { roleManagementConfig } from "../config/roleManagement";
import { useTranslations } from "@/lib/i18n/useTranslation";

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
    if (!isSubmittingRef.current && defaultValues && defaultValuesRef.current !== defaultValues) {
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
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[200px]">Feature</TableHead>
                  <TableHead className="text-center">Create</TableHead>
                  <TableHead className="text-center">Read</TableHead>
                  <TableHead className="text-center">Update</TableHead>
                  <TableHead className="text-center">Delete</TableHead>
                  <TableHead className="text-center">Print</TableHead>
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

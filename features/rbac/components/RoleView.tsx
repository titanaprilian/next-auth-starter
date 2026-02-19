"use client";

import { useTranslations } from "@/lib/i18n/useTranslation";
import { Check, X } from "lucide-react";
import { Role, Feature } from "../types";
import { roleManagementConfig } from "../config/roleManagement";
import { RoleViewSkeleton } from "./RoleViewSkeleton";

interface RoleViewProps {
  role: Role | null | undefined;
  features?: Feature[];
  isLoading?: boolean;
}

export function RoleView({ role, features, isLoading }: RoleViewProps) {
  const t = useTranslations();

  if (isLoading) {
    return <RoleViewSkeleton />;
  }

  if (!role) {
    return null;
  }

  const fields = roleManagementConfig.viewFields.map((field) => {
    let value: string | React.ReactNode = "";

    switch (field.value) {
      case "name":
        value = role.name;
        break;
      case "description":
        value = role.description || "-";
        break;
    }

    return {
      ...field,
      label: t(field.labelKey),
      value,
    };
  });

  const AvatarIcon = roleManagementConfig.avatarIcon;

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-2 py-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-branding-dark">
          <AvatarIcon className="h-7 w-7 text-white" />
        </div>
        <div className="text-center">
          <h3 className="text-base font-semibold">{role.name}</h3>
          <p className="text-xs text-muted-foreground">{role.description || "-"}</p>
        </div>
      </div>

      <div className="rounded-lg border">
        {fields.map((field, index) => (
          <div
            key={field.labelKey}
            className={`flex items-center gap-3 px-3 py-2.5 ${
              index !== fields.length - 1 ? "border-b" : ""
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <field.icon className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">{field.label}</p>
              <p className="font-medium text-sm">{field.value}</p>
            </div>
          </div>
        ))}
      </div>

      {role.permissions && role.permissions.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground px-1">
            {t("role.fields.permissions")}
          </p>
          <div className="rounded-lg border">
            <div className="flex items-center justify-between gap-3 px-3 py-2 border-b bg-muted/50">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground">Feature</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground w-12 text-center">
                  {t("role.permission.create")}
                </span>
                <span className="text-xs font-medium text-muted-foreground w-12 text-center">
                  {t("role.permission.read")}
                </span>
                <span className="text-xs font-medium text-muted-foreground w-12 text-center">
                  {t("role.permission.update")}
                </span>
                <span className="text-xs font-medium text-muted-foreground w-12 text-center">
                  {t("role.permission.delete")}
                </span>
                <span className="text-xs font-medium text-muted-foreground w-12 text-center">
                  {t("role.permission.print")}
                </span>
              </div>
            </div>
            {role.permissions.map((permission, index) => (
              <div
                key={permission.featureId}
                className={`flex items-center justify-between gap-3 px-3 py-2.5 ${
                  index !== role.permissions.length - 1 ? "border-b" : ""
                }`}
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    {permission.feature?.name || permission.featureId}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs w-12 text-center ${
                      permission.canCreate ? "text-green-600" : "text-muted-foreground"
                    }`}
                  >
                    {permission.canCreate ? (
                      <Check className="h-3 w-3 mx-auto" />
                    ) : (
                      <X className="h-3 w-3 mx-auto" />
                    )}
                  </span>
                  <span
                    className={`text-xs w-12 text-center ${
                      permission.canRead ? "text-green-600" : "text-muted-foreground"
                    }`}
                  >
                    {permission.canRead ? (
                      <Check className="h-3 w-3 mx-auto" />
                    ) : (
                      <X className="h-3 w-3 mx-auto" />
                    )}
                  </span>
                  <span
                    className={`text-xs w-12 text-center ${
                      permission.canUpdate ? "text-green-600" : "text-muted-foreground"
                    }`}
                  >
                    {permission.canUpdate ? (
                      <Check className="h-3 w-3 mx-auto" />
                    ) : (
                      <X className="h-3 w-3 mx-auto" />
                    )}
                  </span>
                  <span
                    className={`text-xs w-12 text-center ${
                      permission.canDelete ? "text-green-600" : "text-muted-foreground"
                    }`}
                  >
                    {permission.canDelete ? (
                      <Check className="h-3 w-3 mx-auto" />
                    ) : (
                      <X className="h-3 w-3 mx-auto" />
                    )}
                  </span>
                  <span
                    className={`text-xs w-12 text-center ${
                      permission.canPrint ? "text-green-600" : "text-muted-foreground"
                    }`}
                  >
                    {permission.canPrint ? (
                      <Check className="h-3 w-3 mx-auto" />
                    ) : (
                      <X className="h-3 w-3 mx-auto" />
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-[10px] text-muted-foreground space-y-0.5">
        <p>Created: {new Date(role.createdAt).toLocaleString()}</p>
        {role.updatedAt && (
          <p>Last Updated: {new Date(role.updatedAt).toLocaleString()}</p>
        )}
      </div>
    </div>
  );
}

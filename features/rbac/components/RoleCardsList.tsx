"use client";

import { useTranslations } from "@/lib/i18n/useTranslation";
import { Eye, Pencil, Trash2, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { RoleListItem, Role } from "../types";

interface RoleCardProps {
  role: RoleListItem;
  index: number;
  page: number;
  limit: number;
  onView: (role: Role) => void;
  onEdit: (role: Role) => void;
  onDelete: (role: RoleListItem) => void;
  permissions?: {
    canRead?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
  };
}

export function RoleCard({
  role,
  index,
  page,
  limit,
  onView,
  onEdit,
  onDelete,
  permissions,
}: RoleCardProps) {
  const t = useTranslations();

  const canView = permissions?.canRead ?? true;
  const canEdit = permissions?.canUpdate ?? true;
  const canDelete = permissions?.canDelete ?? true;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-branding-dark text-white text-xs">
              {(page - 1) * limit + index + 1}
            </span>
            <div>
              <p className="font-semibold text-base">{role.name}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-1 gap-2 text-sm">
          {role.description && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>{role.description}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{new Date(role.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2">
        {canView && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 bg-branding-dark text-white hover:bg-branding-dark/80"
            onClick={() => onView(role as Role)}
          >
            <Eye className="h-3 w-3 mr-1" />
            {t("role.button.view")}
          </Button>
        )}
        {canEdit && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 bg-orange-500 text-white hover:bg-orange-500/80"
            onClick={() => onEdit(role as Role)}
          >
            <Pencil className="h-3 w-3 mr-1" />
            {t("role.button.edit")}
          </Button>
        )}
        {canDelete && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 bg-destructive text-white hover:bg-destructive/80"
            onClick={() => onDelete(role)}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            {t("role.button.delete")}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

interface RoleCardsListProps {
  data: RoleListItem[];
  page: number;
  limit: number;
  onView: (role: Role) => void;
  onEdit: (role: Role) => void;
  onDelete: (role: RoleListItem) => void;
  permissions?: {
    canCreate?: boolean;
    canRead?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
  };
}

export function RoleCardsList({
  data,
  page,
  limit,
  onView,
  onEdit,
  onDelete,
  permissions,
}: RoleCardsListProps) {
  const t = useTranslations();

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="flex h-24 items-center justify-center text-muted-foreground">
          {t("role.table.noResults")}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {data.map((role, index) => (
        <RoleCard
          key={role.id}
          role={role}
          index={index}
          page={page}
          limit={limit}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          permissions={permissions}
        />
      ))}
    </div>
  );
}

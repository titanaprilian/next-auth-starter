"use client";

import { useState, useRef } from "react";
import { useTranslations } from "@/lib/i18n/useTranslation";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import { RoleListItem, Role } from "../types";
import { roleManagementConfig } from "../config/roleManagement";
import { RoleCardsList } from "./RoleCardsList";

export interface RolesTableProps {
  data: RoleListItem[];
  isLoading: boolean;
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
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

const TableSkeleton = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <TableRow key={i}>
        <TableCell className="px-4 py-3">
          <Skeleton className="h-4 w-[30px]" />
        </TableCell>
        <TableCell className="px-4 py-3">
          <Skeleton className="h-4 w-[150px]" />
        </TableCell>
        <TableCell className="px-4 py-3">
          <Skeleton className="h-4 w-[250px]" />
        </TableCell>
        <TableCell className="hidden md:table-cell px-4 py-3">
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
        <TableCell className="px-4 py-3">
          <div className="flex gap-1">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </TableCell>
      </TableRow>
    ))}
  </>
);

export function RolesTable({
  data,
  isLoading,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  onView,
  onEdit,
  onDelete,
  permissions,
}: RolesTableProps) {
  const t = useTranslations();
  const [viewingId, setViewingId] = useState<string | null>(null);
  const tableConfig = roleManagementConfig.table;
  const tableRef = useRef<HTMLDivElement>(null);

  // Default to true if permissions not provided (backward compatibility)
  const canView = permissions?.canRead ?? true;
  const canEdit = permissions?.canUpdate ?? true;
  const canDelete = permissions?.canDelete ?? true;
  const showActions = canView || canEdit || canDelete;

  const handleView = async (role: RoleListItem) => {
    setViewingId(role.id);
    setTimeout(async () => {
      await onView(role as Role);
      setViewingId(null);
    }, 0);
  };

  const handleEdit = (role: RoleListItem) => {
    onEdit(role as Role);
  };

  return (
    <Card>
      <CardContent className="p-0">
        {/* Desktop Table View - hidden on mobile, visible on lg+ */}
        <div ref={tableRef} className="hidden md:block relative w-full overflow-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] px-4 py-3">{t(tableConfig.no)}</TableHead>
                <TableHead className="min-w-[120px] px-4 py-3">
                  {t(tableConfig.name)}
                </TableHead>
                <TableHead className="min-w-[180px] px-4 py-3">
                  {t(tableConfig.description)}
                </TableHead>
                <TableHead className="hidden md:table-cell min-w-[120px] px-4 py-3">
                  {t(tableConfig.createdAt)}
                </TableHead>
                {showActions && (
                  <TableHead className="w-[100px] px-4 py-3">
                    {t(tableConfig.actions)}
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton />
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {t(tableConfig.noResults)}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((role, index) => (
                  <TableRow key={role.id}>
                    <TableCell className="px-4 py-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-branding-dark text-white text-xs">
                        {(page - 1) * limit + index + 1}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium px-4 py-3">{role.name}</TableCell>
                    <TableCell className="text-muted-foreground px-4 py-3">
                      {role.description || "-"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground px-4 py-3">
                      {new Date(role.createdAt).toLocaleDateString()}
                    </TableCell>
                    {showActions && (
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {canView && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 bg-branding-dark hover:bg-branding-dark/90"
                              onClick={() => handleView(role)}
                              disabled={viewingId !== null}
                            >
                              <Eye className="h-4 w-4 text-white" />
                            </Button>
                          )}
                          {canEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 bg-orange-500 hover:bg-orange-600"
                              onClick={() => handleEdit(role)}
                              disabled={viewingId !== null}
                            >
                              <Pencil className="h-4 w-4 text-white" />
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 bg-destructive hover:bg-destructive/90"
                              onClick={() => onDelete(role)}
                              disabled={viewingId !== null}
                            >
                              <Trash2 className="h-4 w-4 text-white" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards View - visible on mobile, hidden on lg+ */}
        <div ref={tableRef} className="md:hidden p-4">
          {isLoading ? (
            <div className="flex flex-col gap-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-[120px] mb-2" />
                    <Skeleton className="h-4 w-[180px] mb-2" />
                    <Skeleton className="h-4 w-[100px]" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <RoleCardsList
              data={data}
              page={page}
              limit={limit}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              permissions={permissions}
            />
          )}
        </div>

        <TablePagination
          page={page}
          limit={limit}
          total={total}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
          showingText={t(roleManagementConfig.pagination.showingKey)}
          rowsText={t(roleManagementConfig.pagination.rowsKey)}
          scrollRef={tableRef}
        />
      </CardContent>
    </Card>
  );
}

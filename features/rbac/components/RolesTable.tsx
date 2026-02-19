"use client";

import { useState } from "react";
import { useTranslations } from "@/lib/i18n/useTranslation";
import {
  Eye,
  Pencil,
  Trash2,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoleListItem, Role } from "../types";
import { roleManagementConfig } from "../config/roleManagement";

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
}

const TableSkeleton = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <TableRow key={i}>
        <TableCell>
          <Skeleton className="h-4 w-[30px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[150px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[250px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[100px]" />
        </TableCell>
        <TableCell>
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

const getPageNumbers = (
  currentPage: number,
  totalPages: number,
): (number | "...")[] => {
  const pages: (number | "...")[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
      );
    }
  }

  return pages;
};

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
}: RolesTableProps) {
  const t = useTranslations();
  const [viewingId, setViewingId] = useState<string | null>(null);
  const tableConfig = roleManagementConfig.table;

  const totalPages = Math.ceil(total / limit);
  const pageNumbers = getPageNumbers(page, totalPages);

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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] px-4">
                  {t(tableConfig.no)}
                </TableHead>
                <TableHead className="w-[25%] px-4">
                  {t(tableConfig.name)}
                </TableHead>
                <TableHead className="w-[40%] px-4">
                  {t(tableConfig.description)}
                </TableHead>
                <TableHead className="w-[15%] px-4">
                  {t(tableConfig.createdAt)}
                </TableHead>
                <TableHead className="w-[10%] px-4">
                  {t(tableConfig.actions)}
                </TableHead>
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
                    <TableCell className="px-4">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-branding-dark text-white text-xs">
                        {(page - 1) * limit + index + 1}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium px-4">
                      {role.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground px-4">
                      {role.description || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground px-4">
                      {new Date(role.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 bg-branding-dark hover:bg-branding-dark/90"
                          onClick={() => handleView(role)}
                          disabled={viewingId !== null}
                        >
                          <Eye className="h-4 w-4 text-white" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 bg-orange-500 hover:bg-orange-600"
                          onClick={() => handleEdit(role)}
                          disabled={viewingId !== null}
                        >
                          <Pencil className="h-4 w-4 text-white" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 bg-destructive hover:bg-destructive/90"
                          onClick={() => onDelete(role)}
                          disabled={viewingId !== null}
                        >
                          <Trash2 className="h-4 w-4 text-white" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between border-t px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {t(roleManagementConfig.pagination.showingKey, {
                start: (page - 1) * limit + 1,
                end: Math.min(page * limit, total),
                total,
              })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange(1)}
                disabled={page <= 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {pageNumbers.map((p, idx) =>
                p === "..." ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-1 text-muted-foreground"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={p}
                    variant={page === p ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onPageChange(p)}
                  >
                    {p}
                  </Button>
                ),
              )}

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange(totalPages)}
                disabled={page >= totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <span className="text-sm text-muted-foreground">
                {t(roleManagementConfig.pagination.rowsKey)}:
              </span>
              <Select
                value={String(limit)}
                onValueChange={(value) => onLimitChange(Number(value))}
              >
                <SelectTrigger className="w-[70px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

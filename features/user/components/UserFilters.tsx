"use client";

import { useTranslations } from "@/lib/i18n/useTranslation";
import { Search, Filter, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Role } from "../types";
import { userManagementConfig } from "../config/userManagement";

interface UserFiltersProps {
  search: string;
  role: string;
  roles: Role[] | undefined;
  isLoadingRoles: boolean;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
}

export function UserFilters({
  search,
  role,
  roles,
  isLoadingRoles,
  onSearchChange,
  onRoleChange,
}: UserFiltersProps) {
  const t = useTranslations();
  const currentRole = roles?.find((r) => r.id === role);

  return (
    <Card>
      <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Filter className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="font-semibold">Filters</h2>
            <p className="text-sm text-muted-foreground">
              {t(userManagementConfig.filterDescriptionKey)}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t(userManagementConfig.searchPlaceholderKey)}
              className="w-full pl-9"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-[130px]"
                disabled={isLoadingRoles}
              >
                {isLoadingRoles
                  ? t("common.loading")
                  : currentRole?.name || t("common.all")}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onRoleChange("all")}>
                {t("common.all")}
              </DropdownMenuItem>
              {roles?.map((r) => (
                <DropdownMenuItem
                  key={r.id}
                  onClick={() => onRoleChange(r.id)}
                >
                  {r.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

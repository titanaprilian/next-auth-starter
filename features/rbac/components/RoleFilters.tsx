"use client";

import { useTranslations } from "@/lib/i18n/useTranslation";
import { Search, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { roleManagementConfig } from "../config/roleManagement";

interface RoleFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function RoleFilters({
  search,
  onSearchChange,
}: RoleFiltersProps) {
  const t = useTranslations();

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
              {t(roleManagementConfig.filterDescriptionKey)}
            </p>
          </div>
        </div>

        <div className="w-full sm:w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t(roleManagementConfig.searchPlaceholderKey)}
              className="w-full pl-9"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { useTranslations } from "@/lib/i18n/useTranslation";
import { Shield, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { roleManagementConfig } from "../config/roleManagement";

interface RoleManagementHeaderProps {
  onAddRole?: () => void;
  canCreate?: boolean;
}

export function RoleManagementHeader({
  onAddRole,
  canCreate = true,
}: RoleManagementHeaderProps) {
  const t = useTranslations();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-branding-dark">
          <Shield className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            {t(roleManagementConfig.pageTitleKey)}
          </h1>
          <p className="text-muted-foreground">
            {t(roleManagementConfig.descriptionKey)}
          </p>
        </div>
      </div>
      {canCreate && (
        <Button className="bg-branding-dark" onClick={onAddRole}>
          <Plus className="mr-2 h-4 w-4" />
          {t("role.add.title")}
        </Button>
      )}
    </div>
  );
}

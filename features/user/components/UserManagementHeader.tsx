import { useTranslations } from "@/lib/i18n/useTranslation";
import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { userManagementConfig } from "../config/userManagement";

interface UserManagementHeaderProps {
  onAddUser?: () => void;
  canCreate?: boolean;
}

export function UserManagementHeader({
  onAddUser,
  canCreate = true,
}: UserManagementHeaderProps) {
  const t = useTranslations();
  const addTitle = t("user.add.title");
  const addLabel = addTitle.split(" ")[0];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-lg sm:rounded-xl bg-branding-dark">
          <Users className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
        </div>
        <div>
          <h1 className="text-lg sm:text-2xl font-bold">
            {t(userManagementConfig.pageTitleKey)}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
            {t(userManagementConfig.descriptionKey)}
          </p>
        </div>
      </div>
      {canCreate && (
        <Button className="bg-branding-dark h-9 sm:h-10" onClick={onAddUser}>
          <Plus className="mr-1 sm:mr-2 h-4 w-4" />
          <span className="hidden sm:inline">{addTitle}</span>
          <span className="sm:hidden">{addLabel}</span>
        </Button>
      )}
    </div>
  );
}

import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { userManagementConfig } from "../config/userManagement";

interface UserManagementHeaderProps {
  onAddUser?: () => void;
}

export function UserManagementHeader({ onAddUser }: UserManagementHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-branding-dark">
          <Users className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            {userManagementConfig.pageTitle}
          </h1>
          <p className="text-muted-foreground">
            {userManagementConfig.description}
          </p>
        </div>
      </div>
      <Button className="bg-branding-dark" onClick={onAddUser}>
        <Plus className="mr-2 h-4 w-4" />
        Add User
      </Button>
    </div>
  );
}

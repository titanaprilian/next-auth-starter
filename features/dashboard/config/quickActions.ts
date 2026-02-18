import { LucideIcon, Users, Shield } from "lucide-react";

/**
 * Quick action configuration.
 */
export interface QuickAction {
  titleKey: string;
  descriptionKey: string;
  href: string;
  icon: LucideIcon;
}

/**
 * Quick actions configuration.
 * Add or remove actions here to update the quick actions.
 */
export const quickActionsConfig: QuickAction[] = [
  {
    titleKey: "dashboard.quickActions.manageUsers",
    descriptionKey: "dashboard.quickActions.manageUsersDesc",
    href: "/management/users",
    icon: Users,
  },
  {
    titleKey: "dashboard.quickActions.rolePermissions",
    descriptionKey: "dashboard.quickActions.rolePermissionsDesc",
    href: "/management/roles",
    icon: Shield,
  },
];

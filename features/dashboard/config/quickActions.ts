import { LucideIcon, Users, Shield } from "lucide-react";

/**
 * Quick action configuration.
 */
export interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

/**
 * Quick actions configuration.
 * Add or remove actions here to update the quick actions.
 */
export const quickActionsConfig: QuickAction[] = [
  {
    title: "Manage Users",
    description: "Add, edit, or remove users from the system",
    href: "/management/users",
    icon: Users,
  },
  {
    title: "Role & Permissions",
    description: "Manage roles and their permissions",
    href: "/management/roles",
    icon: Shield,
  },
];

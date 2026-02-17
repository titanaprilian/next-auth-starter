import { LucideIcon, LayoutDashboard, Users, Shield } from "lucide-react";

/**
 * Sidebar navigation item configuration.
 * 
 * @property label - Display label for the menu item
 * @property icon - Lucide icon component
 * @property href - Route path (for single items)
 * @property children - Sub-menu items (for collapsible menus)
 * 
 * @example
 * // Single menu item
 * { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" }
 * 
 * @example
 * // Collapsible menu with children
 * { 
 *   label: "Management", 
 *   icon: Users, 
 *   children: [
 *     { label: "User Management", icon: Users, href: "/management/users" },
 *     { label: "Role & Permissions", icon: Shield, href: "/management/roles" }
 *   ]
 * }
 */
export interface SidebarNavItem {
  label: string;
  icon: LucideIcon;
  href?: string;
  children?: SidebarNavItem[];
}

/**
 * System information displayed at the bottom of the sidebar.
 */
export interface SidebarFooter {
  name: string;
  version?: string;
}

/**
 * Sidebar configuration.
 */
export const sidebarConfig: SidebarNavItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Management",
    icon: Users,
    children: [
      {
        label: "User Management",
        icon: Users,
        href: "/management/users",
      },
      {
        label: "Role & Permissions",
        icon: Shield,
        href: "/management/roles",
      },
    ],
  },
];

/**
 * Sidebar footer configuration.
 * Edit here to change the system name and version.
 */
export const sidebarFooterConfig: SidebarFooter = {
  name: "RBAC Admin",
  version: "v1.0",
};

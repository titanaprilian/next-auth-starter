import { LucideIcon, LayoutDashboard, Users, Shield } from "lucide-react";

/**
 * Sidebar navigation item configuration.
 *
 * @property labelKey - Translation key for the menu item
 * @property icon - Lucide icon component
 * @property href - Route path (for single items)
 * @property children - Sub-menu items (for collapsible menus)
 *
 * @example
 * // Single menu item
 * { labelKey: "navigation.dashboard", icon: LayoutDashboard, href: "/dashboard" }
 *
 * @example
 * // Collapsible menu with children
 * {
 *   labelKey: "navigation.management",
 *   icon: Users,
 *   children: [
 *     { labelKey: "navigation.users", icon: Users, href: "/management/users" },
 *     { labelKey: "navigation.roles", icon: Shield, href: "/management/roles" }
 *   ]
 * }
 */
export interface SidebarNavItem {
  labelKey: string;
  icon: LucideIcon;
  href?: string;
  children?: SidebarNavItem[];
}

/**
 * System information displayed at the bottom of the sidebar.
 */
export interface SidebarFooter {
  nameKey: string;
  versionKey?: string;
}

/**
 * Sidebar configuration.
 */
export const sidebarConfig: SidebarNavItem[] = [
  {
    labelKey: "navigation.dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    labelKey: "navigation.management",
    icon: Users,
    children: [
      {
        labelKey: "navigation.users",
        icon: Users,
        href: "/management/users",
      },
      {
        labelKey: "navigation.roles",
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
  nameKey: "navigation.systemName",
  versionKey: "navigation.systemVersion",
};

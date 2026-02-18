import { LucideIcon, Users, Shield } from "lucide-react";

/**
 * Available color options for stat cards.
 */
export type StatCardColor =
  | "blue"
  | "green"
  | "red"
  | "yellow"
  | "purple"
  | "orange";

/**
 * Dashboard stat card configuration.
 */
export interface DashboardStatCard {
  titleKey: string;
  value: string | number;
  icon: LucideIcon;
  color?: StatCardColor;
  descriptionKey?: string;
}

/**
 * Color utility for stat cards.
 */
export const statCardColorStyles: Record<StatCardColor, string> = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  red: "bg-red-100 text-red-600",
  yellow: "bg-yellow-100 text-yellow-600",
  purple: "bg-purple-100 text-purple-600",
  orange: "bg-orange-100 text-orange-600",
};

/**
 * Dashboard stats cards configuration.
 * Add or remove cards here to update the dashboard stats.
 */
export const dashboardStatsConfig: DashboardStatCard[] = [
  {
    titleKey: "dashboard.stats.totalUsers",
    value: 156,
    icon: Users,
    color: "blue",
    descriptionKey: "dashboard.stats.totalUsersDesc",
  },
  {
    titleKey: "dashboard.stats.activeUsers",
    value: 142,
    icon: Users,
    color: "green",
    descriptionKey: "dashboard.stats.activeUsersDesc",
  },
  {
    titleKey: "dashboard.stats.totalRoles",
    value: 8,
    icon: Shield,
    color: "purple",
    descriptionKey: "dashboard.stats.totalRolesDesc",
  },
  {
    titleKey: "dashboard.stats.permissions",
    value: 24,
    icon: Shield,
    color: "orange",
    descriptionKey: "dashboard.stats.permissionsDesc",
  },
];

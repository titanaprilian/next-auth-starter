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
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: StatCardColor;
  description?: string;
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
    title: "Total Users",
    value: 156,
    icon: Users,
    color: "blue",
    description: "Active users in the system",
  },
  {
    title: "Total Roles",
    value: 8,
    icon: Shield,
    color: "purple",
    description: "Defined roles in the system",
  },
  {
    title: "Total Roles",
    value: 8,
    icon: Shield,
    color: "purple",
    description: "Defined roles in the system",
  },
  {
    title: "Total Users",
    value: 156,
    icon: Users,
    color: "blue",
    description: "Active users in the system",
  },
];

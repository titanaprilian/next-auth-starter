import { LucideIcon, Users, Shield, UserCog, FileKey } from "lucide-react";

export type StatCardColor =
  | "blue"
  | "green"
  | "red"
  | "yellow"
  | "purple"
  | "orange";

export type DashboardStatCard = {
  titleKey: string;
  value?: number;
  icon: LucideIcon;
  color?: StatCardColor;
  descriptionKey?: string;
  dataKey: keyof {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    totalRoles: number;
    totalFeatures: number;
  };
};

export const statCardColorStyles: Record<StatCardColor, string> = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  red: "bg-red-100 text-red-600",
  yellow: "bg-yellow-100 text-yellow-600",
  purple: "bg-purple-100 text-purple-600",
  orange: "bg-orange-100 text-orange-600",
};

export const dashboardStatsConfig: DashboardStatCard[] = [
  {
    titleKey: "dashboard.stats.totalUsers",
    dataKey: "totalUsers",
    icon: Users,
    color: "blue",
    descriptionKey: "dashboard.stats.totalUsersDesc",
  },
  {
    titleKey: "dashboard.stats.activeUsers",
    dataKey: "activeUsers",
    icon: UserCog,
    color: "green",
    descriptionKey: "dashboard.stats.activeUsersDesc",
  },
  {
    titleKey: "dashboard.stats.totalRoles",
    dataKey: "totalRoles",
    icon: Shield,
    color: "purple",
    descriptionKey: "dashboard.stats.totalRolesDesc",
  },
  {
    titleKey: "dashboard.stats.permissions",
    dataKey: "totalFeatures",
    icon: FileKey,
    color: "orange",
    descriptionKey: "dashboard.stats.permissionsDesc",
  },
];

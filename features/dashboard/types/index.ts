export interface DashboardUserDistribution {
  roleName: string;
  count: number;
}

export type UserDistributionData = DashboardUserDistribution;

export interface DashboardData {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalRoles: number;
  totalFeatures: number;
  userDistribution: DashboardUserDistribution[];
}

export interface DashboardResponse {
  data: DashboardData;
}

export interface ApiDashboardResponse {
  error: boolean;
  code: number;
  message: string;
  data: DashboardData;
}

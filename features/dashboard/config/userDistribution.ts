/**
 * User distribution data configuration.
 */
export interface UserDistributionData {
  roleKey: string;
  count: number;
  color?: string;
}

/**
 * User distribution configuration.
 * Add or update roles here to change the displayed data.
 */
export const userDistributionConfig: UserDistributionData[] = [
  { roleKey: "dashboard.userDistribution.admin", count: 5, color: "#3b82f6" },
  { roleKey: "dashboard.userDistribution.manager", count: 12, color: "#8b5cf6" },
  { roleKey: "dashboard.userDistribution.user", count: 89, color: "#22c55e" },
  { roleKey: "dashboard.userDistribution.guest", count: 50, color: "#f59e0b" },
];

/**
 * Calculate total users across all roles.
 */
export const getTotalUsers = (): number => {
  return userDistributionConfig.reduce((sum, item) => sum + item.count, 0);
};

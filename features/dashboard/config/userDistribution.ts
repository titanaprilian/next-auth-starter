/**
 * User distribution data configuration.
 */
export interface UserDistributionData {
  role: string;
  count: number;
  color?: string;
}

/**
 * User distribution configuration.
 * Add or update roles here to change the displayed data.
 */
export const userDistributionConfig: UserDistributionData[] = [
  { role: "Admin", count: 5, color: "#3b82f6" },
  { role: "Manager", count: 12, color: "#8b5cf6" },
  { role: "User", count: 89, color: "#22c55e" },
  { role: "Guest", count: 50, color: "#f59e0b" },
];

/**
 * Calculate total users across all roles.
 */
export const getTotalUsers = (): number => {
  return userDistributionConfig.reduce((sum, item) => sum + item.count, 0);
};

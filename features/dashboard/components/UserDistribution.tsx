import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  userDistributionConfig,
  getTotalUsers,
} from "@features/dashboard/config/userDistribution";

/**
 * Renders a single distribution bar.
 */
const DistributionBar = ({
  role,
  count,
  color,
  percentage,
}: {
  role: string;
  count: number;
  color: string;
  percentage: number;
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{role}</span>
        <span className="text-muted-foreground">
          {count} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
};

/**
 * User distribution component.
 * Displays a bar chart showing user count per role.
 *
 * @example
 * <UserDistribution />
 */
export function UserDistribution() {
  const total = getTotalUsers();

  return (
    <Card className="bg-white h-full transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle>User Distribution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">Total: {total} users</p>
        <div className="space-y-4">
          {userDistributionConfig.map((item) => (
            <DistributionBar
              key={item.role}
              role={item.role}
              count={item.count}
              color={item.color || "#3b82f6"}
              percentage={total > 0 ? (item.count / total) * 100 : 0}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

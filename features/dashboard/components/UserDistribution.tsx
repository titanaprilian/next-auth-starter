import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  userDistributionConfig,
  getTotalUsers,
} from "@features/dashboard/config/userDistribution";
import { useTranslations } from "@/lib/i18n/useTranslation";

/**
 * Renders a single distribution bar.
 */
const DistributionBar = ({
  roleKey,
  count,
  color,
  percentage,
}: {
  roleKey: string;
  count: number;
  color: string;
  percentage: number;
}) => {
  const t = useTranslations();

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{t(roleKey)}</span>
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
  const t = useTranslations();
  const total = getTotalUsers();

  return (
    <Card className="bg-white h-full transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle>{t("dashboard.userDistribution.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {t("dashboard.userDistribution.total", { total })}
        </p>
        <div className="space-y-4">
          {userDistributionConfig.map((item) => (
            <DistributionBar
              key={item.roleKey}
              roleKey={item.roleKey}
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

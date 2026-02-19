import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserDistributionData } from "../types";
import { useTranslations } from "@/lib/i18n/useTranslation";

const DEFAULT_COLORS = ["#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b", "#ef4444", "#ec4899"];

interface UserDistributionProps {
  data?: UserDistributionData[];
}

const DistributionBar = ({
  roleName,
  count,
  color,
  percentage,
}: {
  roleName: string;
  count: number;
  color: string;
  percentage: number;
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{roleName}</span>
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

export function UserDistribution({ data }: UserDistributionProps) {
  const t = useTranslations();
  const total = data?.reduce((sum, item) => sum + item.count, 0) ?? 0;

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
          {data?.map((item, index) => (
            <DistributionBar
              key={item.roleName}
              roleName={item.roleName}
              count={item.count}
              color={DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
              percentage={total > 0 ? (item.count / total) * 100 : 0}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

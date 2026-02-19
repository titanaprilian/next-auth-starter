import { Card, CardContent } from "@/components/ui/card";
import {
  dashboardStatsConfig,
  DashboardStatCard,
  statCardColorStyles,
} from "@features/dashboard/config/dashboardStats";
import { useTranslations } from "@/lib/i18n/useTranslation";
import { DashboardData } from "../types";

const DEFAULT_COLOR = "blue";

interface DashboardStatsProps {
  data?: DashboardData;
}

const StatCard = ({ card, value }: { card: DashboardStatCard; value?: number }) => {
  const t = useTranslations();
  const Icon = card.icon;
  const colorClass =
    statCardColorStyles[card.color || DEFAULT_COLOR] ||
    statCardColorStyles[DEFAULT_COLOR];

  return (
    <Card className="bg-white transition-all hover:-translate-y-1 hover:shadow-md">
      <CardContent className="flex items-center gap-4 py-5">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${colorClass}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {t(card.titleKey)}
          </p>
          <p className="text-2xl font-bold">{value ?? "-"}</p>
          {card.descriptionKey && (
            <p className="text-xs text-muted-foreground">{t(card.descriptionKey)}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export function DashboardStats({ data }: DashboardStatsProps) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {dashboardStatsConfig.map((card, index) => (
        <StatCard 
          key={index} 
          card={card} 
          value={data ? data[card.dataKey] : undefined} 
        />
      ))}
    </div>
  );
}

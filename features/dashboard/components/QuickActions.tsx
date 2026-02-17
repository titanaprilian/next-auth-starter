import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { quickActionsConfig, QuickAction } from "@features/dashboard/config/quickActions";

/**
 * Renders a single quick action row.
 */
const ActionRow = ({ action }: { action: QuickAction }) => {
  const Icon = action.icon;

  return (
    <div className="flex items-center gap-4 rounded-lg border p-4 transition-all hover:bg-muted/50">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-branding-dark/10">
        <Icon className="h-5 w-5 text-branding-dark" />
      </div>
      <div className="flex-1">
        <p className="font-semibold">{action.title}</p>
        <p className="text-sm text-muted-foreground">{action.description}</p>
      </div>
      <Button asChild variant="outline" size="sm">
        <Link href={action.href}>Go</Link>
      </Button>
    </div>
  );
};

/**
 * Quick actions component.
 * Displays quick action items inside a card.
 * 
 * @example
 * <QuickActions />
 */
export function QuickActions() {
  return (
    <Card className="bg-white h-full transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {quickActionsConfig.map((action, index) => (
          <ActionRow key={index} action={action} />
        ))}
      </CardContent>
    </Card>
  );
}

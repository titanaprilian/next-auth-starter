"use client";

import React from "react";
import { useAuth } from "@features/auth/context/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations, useLocale } from "@/lib/i18n/useTranslation";

/**
 * Gets greeting key and emoji based on current time of day.
 */
const getGreeting = (): { key: string; emoji: string } => {
  const hour = new Date().getHours();
  if (hour < 12) return { key: "dashboard.greeting.morning", emoji: "🌅" };
  if (hour < 17) return { key: "dashboard.greeting.afternoon", emoji: "☀️" };
  return { key: "dashboard.greeting.evening", emoji: "🌙" };
};

/**
 * Dashboard header component with greeting and real-time clock.
 * Displayed inside a white card.
 *
 * @example
 * <DashboardHeader />
 */
export function DashboardHeader() {
  const t = useTranslations();
  const locale = useLocale();
  const { user } = useAuth();
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const greeting = getGreeting();

  return (
    <Card className="bg-white transition-shadow hover:shadow-md">
      <CardContent className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        {/* Greeting Section */}
        <div className="text-center">
          <h1 className="text-lg font-bold sm:text-2xl">
            {greeting.emoji} {t(greeting.key)}, {user?.name?.split(" ")[0] || t("dashboard.defaultUser")}!
          </h1>
          <p className="mt-1 text-sm text-muted-foreground text-center sm:text-base">
            {t("dashboard.welcome")}
          </p>
        </div>

        {/* Clock & Date Section */}
        <div className="text-center sm:text-right">
          <p className="text-base font-semibold sm:text-lg">
            {time.toLocaleTimeString(locale, {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </p>
          <p className="text-xs text-muted-foreground sm:text-sm">
            {time.toLocaleDateString(locale, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

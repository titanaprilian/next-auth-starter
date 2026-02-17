"use client";

import React from "react";
import { useAuth } from "@features/auth/context/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Gets greeting with emoji based on current time of day.
 */
const getGreeting = (): { text: string; emoji: string } => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good Morning", emoji: "🌅" };
  if (hour < 17) return { text: "Good Afternoon", emoji: "☀️" };
  return { text: "Good Evening", emoji: "🌙" };
};

/**
 * Formats the current date.
 */
const formatDate = (): string => {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Dashboard header component with greeting and real-time clock.
 * Displayed inside a white card.
 *
 * @example
 * <DashboardHeader />
 */
export function DashboardHeader() {
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
            {greeting.emoji} {greeting.text},{" "}
            {user?.name?.split(" ")[0] || "User"}!
          </h1>
          <p className="mt-1 text-sm text-muted-foreground text-center sm:text-base">
            Welcome to the RBAC Admin System
          </p>
        </div>

        {/* Clock & Date Section */}
        <div className="text-center sm:text-right">
          <p className="text-base font-semibold sm:text-lg">
            {time.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </p>
          <p className="text-xs text-muted-foreground sm:text-sm">
            {formatDate()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

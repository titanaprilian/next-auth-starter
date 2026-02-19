"use client";

import {
  DashboardHeader,
  DashboardStats,
  QuickActions,
  UserDistribution,
} from "@features/dashboard";
import { useFetchDashboard } from "@features/dashboard/hooks/useDashboard";

export default function DashboardPage() {
  const { data } = useFetchDashboard();

  return (
    <div className="p-8">
      <DashboardHeader />
      <DashboardStats data={data} />
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <QuickActions />
        </div>
        <div className="lg:col-span-1">
          <UserDistribution data={data?.userDistribution} />
        </div>
      </div>
    </div>
  );
}

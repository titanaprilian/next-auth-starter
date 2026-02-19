"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@features/auth/context/AuthProvider";
import { fetchDashboard } from "../services/dashboardApi";
import { DashboardData } from "../types";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  detail: () => [...dashboardKeys.all, "detail"] as const,
};

export function useFetchDashboard() {
  const { user, isLoading } = useAuth();

  return useQuery<DashboardData>({
    queryKey: dashboardKeys.detail(),
    queryFn: fetchDashboard,
    enabled: !!user && !isLoading,
  });
}

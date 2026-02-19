import { ApiAxios } from "@utils/axios";
import { ApiDashboardResponse, DashboardData } from "../types";

export async function fetchDashboard(): Promise<DashboardData> {
  const { data } = await ApiAxios.get<ApiDashboardResponse>("/dashboard");
  return data.data;
}

"use client";

import { useQuery } from "@tanstack/react-query";
import System from "./sections/System";
import apiClient from "@/lib/axios";
import { useSyncSystemData } from "@/hooks/useSyncSystemData";
import { T_DashStatic } from "@/app/api/dashboard/static/route";
import LiveResources from "./sections/LiveResources";
import Trends from "./sections/Trends";
import Storage from "./sections/Storage";

// export type T_DashStatic = {
//   hostname: string;
//   os: string;
//   kernel: string;
//   cpuModel: string;
//   cores: string;
//   ip: string;
//   hasBattery: boolean;
// }

type T_Disk = {
  fs: string;
  type: string;
  size: number;
  used: number;
  available: number;
  use: number;
  mount: string;
  rw: boolean;
}

export type T_DashLive = {
  cpu: number;
  disk: T_Disk[];
  memory: number;
  netIn: number;
  netOut: number;
  temp: number;
  timestamp: number;
}

const DashboardView = () => {
  const { isError, isLoading } = useSyncSystemData();
  
  const dashboardStatic = useQuery<T_DashStatic>({
    queryKey: ["dashboard-static"],
    queryFn: async () => {
      const response = await apiClient.get("/dashboard/static");
      const data = response.data;
      
      return data;
    }
  });
  
  return (
    <div className="flex flex-col gap-8">
      <System data={dashboardStatic.data} isLoading={dashboardStatic.isPending}/>
      <LiveResources data={dashboardStatic.data} isLoading={dashboardStatic.isPending}/>
      <Trends data={dashboardStatic.data} isLoading={dashboardStatic.isPending}/>
      <Storage data={dashboardStatic.data} isLoading={dashboardStatic.isPending}/>
    </div>
  );
}

export default DashboardView;
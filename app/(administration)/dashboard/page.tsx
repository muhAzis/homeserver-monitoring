import DashboardView from "@/components/page/(administration)/DashboardView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

const Dashboard = () => {
  return (
    <DashboardView />
  );
};

export default Dashboard;
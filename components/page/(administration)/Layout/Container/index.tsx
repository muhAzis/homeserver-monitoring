"use client";

import { T_IconList } from "@/components/core/Icon";
import AdminSidebar from "../AdminSidebar"
import { usePathname, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { toast } from "sonner";
import AdminInset from "../AdminInset";

export type T_Menu = {
  href: string;
  label: string;
  desc: string;
  icon: T_IconList;
}

type T_Container = {
  children: React.ReactNode;
  hostname: string;
}

const Container = ({ children, hostname }: T_Container) => {
  const pathname = usePathname();
  const router = useRouter();
  
  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));
  
  const menu: T_Menu[] = [
    { href: "/dashboard", label: "Dashboard", desc: "Everything this machine is reporting right now.", icon: "LuLayoutDashboard" },
    { href: "/apps", label: "Apps & Services", desc: "Everything running inside your home server.", icon: "LuBoxes" },
    { href: "/resources", label: "Resources", desc: "Hardware utilisation over the last few minutes.", icon: "LuActivity" },
    { href: "/processes", label: "Processes", desc: "Heaviest tasks competing for this machine.", icon: "LuSlidersHorizontal" },
    { href: "/alerts", label: "Alerts", desc: "Threshold breaches raised on this machine.", icon: "LuBell" },
    { href: "/settings", label: "Settings", desc: "Thresholds and agent configuration.", icon: "LuSettings" },
  ];

  const logout = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      const response = await apiClient.post("/auth/logout")
      const data = response.data;
      
      return data;
    },
    onSuccess: () => {
      toast.success("Logged out successfully");
      router.push("/login");
    },
    onError: (error) => {
      toast.error(`Logout failed: ${error.message}`);
    }
  });

  const handleLogout = async () => {
    await logout.mutateAsync();
  };
  
  return (
    <>
      <AdminSidebar
        menu={menu}
        isActive={isActive}
        handleLogout={handleLogout}
        isLoading={logout.isPending}
        hostname={hostname}
      />
      <AdminInset
        menu={menu}
        isActive={isActive}
        handleLogout={handleLogout}
        isLoading={logout.isPending}
      >
        {children}
      </AdminInset>
    </>
  )
}

export default Container;
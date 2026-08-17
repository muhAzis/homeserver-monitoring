"use client";

import Icon, { T_IconList } from '@/components/core/Icon';
import IconBlock from '@/components/core/IconBlock';
import LiveClock from '@/components/core/LiveClock';
import ThemeSwitcher from '@/components/core/ThemeSwitcher';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import apiClient from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

type T_Menu = {
  href: string;
  label: string;
  desc: string;
  icon: T_IconList;
}

type T_AdminLayout = {
  children: React.ReactNode;
  initialServerTime: number;
}

const AdminLayout = ({ children, initialServerTime }: T_AdminLayout) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
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
      <Sidebar collapsible="icon" className="">
        <SidebarHeader className="border-b border-dark-200 dark:border-dark-500">
          <SidebarHeader>
            <div className="flex items-center gap-3 py-1.5">
              <IconBlock icon="LuServer" variant="twilight" />
              {!collapsed ? (
                <div className="min-w-0 leading-loose">
                  <p className="truncate font-bold tracking-tight">KyouMe Server</p>
                  <p className="font-mono text-xs text-muted-foreground tracking-widest truncate">HOMELAB • LOCAL</p>
                </div>
              ) : null}
            </div>
          </SidebarHeader>
        </SidebarHeader>
        <SidebarContent className='pl-1.5'>
          <SidebarGroup>
            <SidebarGroupLabel>Monitoring</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menu.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive(item.href)}
                      render={<Link href={item.href} className='flex gap-2 items-center' />}
                      tooltip={item.label}
                    >
                      <Icon icon={item.icon} />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter className='pl-3'>
          {!collapsed ? (
            <div className="space-y-3 p-4 text-sm font-mono rounded-xl border border-sidebar-border">
              <div className="flex items-center justify-between">
                <span>apps up</span>
                <span className="tabular-nums text-success">
                  {8}/{12}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>alerts</span>
                <span
                  className={`font-mono text-sm tabular-nums ${true ? "text-destructive" : "text-muted-foreground"}`}
                >
                  {1}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>uptime</span>
                <span className="text-xs tabular-nums text-muted-foreground">14d 13h 1m</span>
              </div>
            </div>
          ) : null}

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                tooltip="Sign out"
                disabled={logout.isPending}
                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Icon icon={logout.isPending ? "LuLoaderCircle" : "LuLogOut"} />
                <span>Sign out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="min-w-0 flex-1 bg-background">
        <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <SidebarTrigger className="shrink-0" />
              <div className="min-w-0">
                <h1 className="truncate text-xl font-bold tracking-tight">{menu.find((item) => isActive(item.href))?.label}</h1>
                <p className="truncate text-sm text-muted-foreground">{menu.find((item) => isActive(item.href))?.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest hidden sm:inline">
                {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span> */}
              <LiveClock initialServerTime={initialServerTime} />
              <span className="hidden items-center gap-2 rounded-full border border-border px-3 py-1 sm:flex">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">online</span>
              </span>
              <ThemeSwitcher />
              <Button
                className="lg:hidden"
                onClick={handleLogout}
                disabled={logout.isPending}
              >
                <Icon icon={logout.isPending ? "LuLoaderCircle" : "LuLogOut"} />
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full space-y-8 px-4 py-6 sm:px-8 sm:py-8">
          {children}
        </main>
      </SidebarInset>
    </>
  )
}

export default AdminLayout
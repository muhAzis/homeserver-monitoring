"use client";

import Icon from "@/components/core/Icon";
import IconBlock from "@/components/core/IconBlock";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import { T_Menu } from "../Container";
import Link from "next/link";

type T_AdminSidebar = {
  menu: T_Menu[];
  isActive: (to: string) => boolean;
  handleLogout: () => Promise<void>;
  isLoading: boolean;
}

const AdminSidebar = ({ menu, isActive, handleLogout, isLoading }: T_AdminSidebar) => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  
  return (
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
              disabled={isLoading}
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <Icon icon={isLoading ? "LuLoaderCircle" : "LuLogOut"} />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AdminSidebar
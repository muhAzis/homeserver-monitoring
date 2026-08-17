import Icon from "@/components/core/Icon";
import LiveClock from "@/components/core/LiveClock";
import ThemeSwitcher from "@/components/core/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { T_Menu } from "../Container";

type T_AdminInset = {
  children: React.ReactNode;
  menu: T_Menu[];
  isActive: (to: string) => boolean;
  initialServerTime: number;
  handleLogout: () => Promise<void>;
  isLoading: boolean;
}

const AdminInset = ({ children, menu, initialServerTime, isActive, handleLogout, isLoading }: T_AdminInset) => {
  return (
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
              disabled={isLoading}
            >
              <Icon icon={isLoading ? "LuLoaderCircle" : "LuLogOut"} />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full space-y-8 px-4 py-6 sm:px-8 sm:py-8">
        {children}
      </main>
    </SidebarInset>
  )
}

export default AdminInset
"use client";

import Icon from "@/components/core/Icon";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type T_ThemeSwitcher = {
  className?: string;
  useLabel?: boolean;
}

const ThemeSwitcher = ({ className }: T_ThemeSwitcher) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  if (!mounted) {
    return (
      <div className={cn(
        "skeleton h-10.5! w-18! rounded-full",
        className
      )}/>
    );
  }
  
  return (
    <div
      className={cn(
        "w-18 p-1 border border-twilight-500/50 hover:border-twilight-500 rounded-full overflow-hidden cursor-pointer transition-all",
        className
      )}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <div
        className={cn(
          "flex w-fit px-2 py-2 bg-twilight-500 text-white rounded-full place-content-center transition-all",
          theme === "dark" ? "translate-x-7.5" : "translate-x-0"
        )}
      >
        <Icon icon={theme === "dark" ? "LuMoon" : "LuSun" }/>
      </div>
    </div>
  )
}

export default ThemeSwitcher
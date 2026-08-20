import { cn } from "@/lib/utils";
import Icon, { T_IconList } from "../Icon"

export type T_IconBlock = {
  icon: T_IconList;
  size?: number;
  variant?: "default" | "primary" | "red" | "green" | "purple" | "orange" | "yellow" | "blue" | "pink" | "cyan" | "lime" | "indigo" | "violet" | "fuchsia" | "rose" | "teal" | "emerald" | "sky" | "amber" | "stone" | "zinc" | "neutral" | "gray" | "slate" | "twilight";
  isLight?: boolean;
  className?: string;
}

const IconBlock = ({ icon, size = 20, variant = "default", isLight = false, className }: T_IconBlock) => {
  const color = !isLight
  ? {
      default: "bg-dark-500",
      primary: "bg-primary-500",
      twilight: "bg-twilight-500",
      red: "bg-red-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      orange: "bg-orange-500",
      yellow: "bg-yellow-500",
      blue: "bg-blue-500",
      pink: "bg-pink-500",
      cyan: "bg-cyan-500",
      lime: "bg-lime-500",
      indigo: "bg-indigo-500",
      violet: "bg-violet-500",
      fuchsia: "bg-fuchsia-500",
      rose: "bg-rose-500",
      teal: "bg-teal-500",
      emerald: "bg-emerald-500",
      sky: "bg-sky-500",
      amber: "bg-amber-500",
      stone: "bg-stone-500",
      zinc: "bg-zinc-500",
      neutral: "bg-neutral-500",
      gray: "bg-muted",
      slate: "bg-slate-500",
    }
  : {
      default: "bg-dark-300/20 text-dark-500 border border-dark-500/30",
      primary: "bg-primary-500/20 text-primary-500 border border-primary-500/30",
      twilight: "bg-twilight-500/20 text-twilight-500 border border-twilight-500/30",
      red: "bg-red-500/20 text-red-500 border border-red-500/30",
      green: "bg-green-500/20 text-green-500 border border-green-500/30",
      purple: "bg-purple-500/20 text-purple-500 border border-purple-500/30",
      orange: "bg-orange-500/20 text-orange-500 border border-orange-500/30",
      yellow: "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30",
      blue: "bg-blue-500/20 text-blue-500 border border-blue-500/30",
      pink: "bg-pink-500/20 text-pink-500 border border-pink-500/30",
      cyan: "bg-cyan-500/20 text-cyan-500 border border-cyan-500/30",
      lime: "bg-lime-500/20 text-lime-500 border border-lime-500/30",
      indigo: "bg-indigo-500/20 text-indigo-500 border border-indigo-500/30",
      violet: "bg-violet-500/20 text-violet-500 border border-violet-500/30",
      fuchsia: "bg-fuchsia-500/20 text-fuchsia-500 border border-fuchsia-500/30",
      rose: "bg-rose-500/20 text-rose-500 border border-rose-500/30",
      teal: "bg-teal-500/20 text-teal-500 border border-teal-500/30",
      emerald: "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30",
      sky: "bg-sky-500/20 text-sky-500 border border-sky-500/30",
      amber: "bg-amber-500/20 text-amber-500 border border-amber-500/30",
      stone: "bg-stone-500/20 text-stone-500 border border-stone-500/30",
      zinc: "bg-zinc-500/20 text-zinc-500 border border-zinc-500/30",
      neutral: "bg-neutral-500/20 text-neutral-500 border border-neutral-500/30",
      gray: "bg-gray-500/20 text-gray-500 border border-gray-500/30",
      slate: "bg-slate-500/20 text-slate-500 border border-slate-500/30",
    }
  return (
    <div className={cn("grid p-3 text-white rounded-xl place-items-center", color[variant], className)}>
      <Icon icon={icon} size={size} className={cn(icon === "LuLoaderCircle" && "animate-spin")} />
    </div>
  )
}

export default IconBlock
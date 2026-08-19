import { cn } from "@/lib/utils";

const colors = {
  twilight: "stroke-twilight-500",
  scarlet: "stroke-scarlet-500",
  almond: "stroke-almond-500",
  blue: "stroke-blue-500",
  teal: "stroke-teal-500"
}

export const textColors: typeof colors = {
  twilight: "text-twilight-500",
  scarlet: "text-scarlet-500",
  almond: "text-almond-500",
  blue: "text-blue-500",
  teal: "text-teal-500"
}

export type T_Tone = keyof typeof colors;

type T_Gauge = {
  value: number;
  unit?: string;
  max?: number;
  tone?: T_Tone;
  className?: string;
}

const Gauge = ({
  value,
  unit = "%",
  max = 100,
  tone = 'twilight',
  className
}: T_Gauge) => {
  const pct = Math.min(Math.max(value / max, 0), 1);
  const r = 34;
  const c = 2 * Math.PI * r;
  
  return (
    <div className={cn("relative h-21 w-21 shrink-0", className)}>
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--muted)" strokeWidth="7" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          // stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${c * pct} ${c}`}
          style={{ transition: "stroke-dasharray 600ms ease" }}
          className={cn(colors[tone])}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-mono text-sm font-semibold tabular-nums">
        {(pct * 100).toFixed(1)}
        <span className="text-[10px] text-muted-foreground">{unit}</span>
      </span>
    </div>
  )
}

export default Gauge
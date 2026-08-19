import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

type T_MetricChart = {
  chartData: {i: number, value: number}[]
  title: string;
  unit: string;
  dataKey: string;
  color: string;
}

const MetricChart = ({ chartData, title, unit, dataKey, color }: T_MetricChart) => {
  const gradientId = `grad-${dataKey}`;
  
  return (
    <div className="mt-3 w-full" style={{ height: 150 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="i" hide />
          <YAxis domain={[0, 100]} hide />
          <Tooltip
            cursor={{ stroke: "var(--border)" }}
            labelFormatter={() => ""}
            formatter={(v: any) => [`${v.toFixed(1)}${unit}`, title]}
            contentStyle={{
              backgroundColor: "var(--popover)",
              borderColor: "var(--border)",
              borderRadius: "0.5rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MetricChart;
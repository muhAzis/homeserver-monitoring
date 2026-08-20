import { T_DashStatic } from "@/app/api/dashboard/static/route";
import Container from "@/components/core/Container";
import { useSystemStore } from "@/store/useSystemStore";
import CardCore from "@/components/core/Card";
import Gauge, { T_Tone, textColors } from "@/components/core/Gauge";
import { T_IconList } from "@/components/core/Icon";
import { cn } from "@/lib/utils";

type T_GaugeData = {
  title: string;
  desc: React.ReactNode;
  icon: T_IconList;
  value: number;
  max: number;
  color: T_Tone;
  unit: string;
}

type T_FooterData = {
  title: string;
  icon: T_IconList;
  value: number;
  unit: string;
}

type T_LiveResources = {
  data: T_DashStatic | undefined;
  isLoading: boolean;
}

const LiveResources = ({ data, isLoading }: T_LiveResources) => {
  const { liveData, history } = useSystemStore();

  const cpuData = liveData?.live_resources?.cpu;
  const memData = liveData?.live_resources?.memory;
  const strgData = liveData?.live_resources?.storage;
  const tempData = liveData?.live_resources?.cpu_temp;

  const netInData = liveData?.live_resources?.net_in;
  const netOutData = liveData?.live_resources?.net_out;
  
  const gaugeData: T_GaugeData[] = [
    {
      title: "cpu",
      icon: "LuCpu",
      value: Number(cpuData?.value.toFixed(1)) ?? 0,
      max: cpuData?.max ?? 100,
      color: "twilight",
      desc: `of ${cpuData?.max.toLocaleString()}${cpuData?.unit ?? "%"} max`,
      unit: cpuData?.unit ?? "%"
    },
    {
      title: "memory",
      icon: "LuMemoryStick",
      value: Number(memData?.value.toFixed(1)) ?? 0,
      max: memData?.max ?? 100,
      color: "blue",
      desc: `of ${memData?.max.toLocaleString()}${memData?.unit ?? "GB"} max`,
      unit: memData?.unit ?? "GB"
    },
    {
      title: "storage",
      icon: "LuHardDrive",
      value: Number(strgData?.value.toFixed(1)) ?? 0,
      max: strgData?.max ?? 100,
      color: "almond",
      desc: `of ${strgData?.max.toLocaleString()}${strgData?.unit ?? "KB"} max`,
      unit: strgData?.unit ?? "KB"
    },
    {
      title: "cpu temp",
      icon: "LuThermometer",
      value: tempData?.value ?? 0,
      max: tempData?.max ?? 100,
      color: "teal",
      desc: `of ${tempData?.max.toLocaleString()}${tempData?.unit ?? "°C"} max`,
      unit: tempData?.unit ?? "°C"
    }
  ];

  const footerData: T_FooterData[] = [
    { title: "net in", icon: "LuZap", value: Number(netInData?.value.toFixed(1)) ?? 0, unit: netInData?.unit ?? "B/s" },
    { title: "net out", icon: "LuZap", value: Number(netOutData?.value.toFixed(1)) ?? 0, unit: netOutData?.unit ?? "B/s" },
    { title: "cpu temp", icon: "LuCpu", value: tempData?.value ?? 0, unit: "°C" },
  ]

  if (isLoading) {
    return (
      <Container title="Live resources" description="sampled every 3s">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="skeleton h-37"/>
          <div className="skeleton h-37"/>
          <div className="skeleton h-37"/>
          <div className="skeleton h-37"/>
        </div>
        <div className="skeleton h-23"/>
      </Container>
    )
  }
  
  return (
    <Container title="Live resources" description="sampled every 3s">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {gaugeData.map((item, idx) => (
          <CardCore
            key={`gauge-data-${item.title}-${idx}`}
            title={item.title}
            titleIcon={item.icon}
          >
            <div className="flex gap-4 items-center">
              <Gauge
                value={item.value}
                max={item.max}
                tone={item.color}
              />
              <div>
                <p className="text-mono">
                  <span className={cn("font-semibold text-2xl", textColors[item.color])}>{item.value.toLocaleString()}</span>
                  {item.unit}
                </p>
                <p className="text-mono">{item.desc}</p>
              </div>
            </div>
          </CardCore>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3">
        {footerData.map((item, idx) => (
          <CardCore
            key={`footer-data-${item.title}-${idx}`}
            title={item.title}
            titleIcon={item.icon}
            className={cn(
              {
                "rounded-b-none md:rounded-xl md:rounded-r-none": idx === 0,
                "rounded-none": idx === 1,
                "rounded-t-none md:rounded-xl md:rounded-l-none": idx === 2,
              }
            )}
          >
            <p className="text-mono text-foreground text-xl font-bold normal-case">
              {item.value} {item.unit}
            </p>
          </CardCore>
        ))}
      </div>
    </Container>
  )
}

export default LiveResources
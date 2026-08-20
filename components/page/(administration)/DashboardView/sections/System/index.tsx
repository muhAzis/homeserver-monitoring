import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Container from "@/components/core/Container";
import Icon from "@/components/core/Icon";
import LiveClock from "@/components/core/LiveClock";
import { T_DashStatic } from "@/app/api/dashboard/static/route";
import { useSystemStore } from "@/store/useSystemStore";
import dayjs from "@/lib/dayjs";
import { cn } from "@/lib/utils";
import CardCore from "@/components/core/Card";
// import { T_DashStatic } from "..";

type T_MachineData = {
  label: string;
  value: string | number | null;
}

type T_System = {
  data: T_DashStatic | undefined;
  isLoading: boolean;
}

const System = ({ data, isLoading }: T_System) => {
  const { liveData, history } = useSystemStore();
  const { machine, storage } = data || {};

  const loadData = liveData?.live_resources?.load_avg;

  const machineData = [
    { label: "hostname", value: machine?.hostname },
    { label: "os", value: machine?.os_distro },
    { label: "kernel", value: machine?.os_kernel },
    { label: "cpu", value: machine?.cpu },
    { label: "cores", value: machine?.cpu_cores },
    { label: "memory", value: machine?.memory },
    { label: "local ip", value: machine?.local_ip },
    { label: "public ip", value: machine?.public_ip },
    { label: "load avg", value: `${loadData?.load1} ${loadData?.load5} ${loadData?.load15}` },
  ]

  const batStat = () => {
    const percentage = liveData?.battery?.percentage || 0;
    switch (true) {
      case percentage < 20:
        return "low";
      case percentage >= 20 && percentage < 50:
        return "medium";
      case percentage >= 50 && percentage < 85:
        return "medium-high";
      case percentage >= 85:
        return "high";
      default:
        return "unknown";
    }
  }

  if (isLoading) {
    return (
      <Container title="System" description="identity · clock · power">
        <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
          <div className="skeleton h-74 col-span-1 md:col-span-3"/>
          <div className="skeleton h-74 col-span-1 md:col-span-3"/>
          <div className="skeleton h-74 col-span-1 md:col-span-4"/>
        </div>
      </Container>
    )
  }
  
  return (
    <Container title="System" description="identity · clock · power">
      <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
        <CardCore
          className="col-span-1 md:col-span-3"
          contentClassName="justify-center"
          title="server time"
          titleIcon="LuClock"
          footer={
            <>
              <div className="flex-1">
                <p className="text-mono">uptime</p>
                <p className="text-foreground text-sm text-mono">{machine?.uptime}</p>
              </div>

              <div className="flex-1">
                <p className="text-mono">timezone</p>
                <p className="text-foreground text-sm text-mono">{machine?.timezone}</p>
              </div>
            </>
          }
        >
          <LiveClock type="clock" className="text-3xl font-semibold text-twilight-500" />
          <LiveClock type="date" className="" format="dddd, DD MMM YYYY" />
        </CardCore>

        <CardCore
          className="col-span-1 md:col-span-3"
          contentClassName="justify-center"
          title="battery"
          titleIcon={
            liveData?.battery?.is_charging
              ? "LuBatteryCharging"
              : batStat() === "low"
                ? "LuBattery"
                : batStat() === "medium"
                  ? "LuBatteryLow"
                  : batStat() === "medium-high"
                    ? "LuBatteryMedium"
                    : batStat() === "high"
                      ? "LuBatteryFull"
                      : "LuBattery"}
          subtitle={liveData?.battery?.is_charging ? 'charging' : 'on battery'}
          footer={
            <>
              <div className="flex-1">
                <p className="text-mono">left</p>
                <p className="text-foreground text-sm text-mono">
                  {liveData?.battery?.time_left
                  ? dayjs(liveData?.battery?.time_left).format("h[H] m[M]")
                  : <Icon icon="LuInfinity" size={24} />}
                </p>
              </div>

              <div className="flex-1">
                <p className="text-mono">health</p>
                <p className="text-foreground text-sm text-mono">{liveData?.battery?.health}</p>
              </div>

              <div className="flex-1">
                <p className="text-mono">voltage</p>
                <p className="text-foreground text-sm text-mono">{liveData?.battery?.voltage}</p>
              </div>
            </>
          }
        >
          <p className="text-mono font-semibold">
            <span className={cn(
              "text-3xl",
              {
                "text-error": batStat() === "low",
                "text-yellow-500": batStat() === "medium",
                "text-info": batStat() === "medium-high",
                "text-success": batStat() === "high",
              }
            )}
            >
              {liveData?.battery?.percentage}
            </span>
            %
          </p>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full",
                {
                  "bg-error": batStat() === "low",
                  "bg-yellow-500": batStat() === "medium",
                  "bg-info": batStat() === "medium-high",
                  "bg-success": batStat() === "high",
                }
              )}
              style={{ width: `${liveData?.battery?.percentage}%` }}
            />
          </div>
        </CardCore>

        <CardCore
          className="col-span-1 md:col-span-4"
          contentClassName="justify-center"
          title="machine"
          titleIcon="LuServer"
          subtitle={`agent ${machine?.app_version}`}
          footer={
            <>
              {machineData?.map((mcn, idx) => (
                <div key={`mcn-data-${idx}`}>
                  <p className="text-mono truncate">{mcn?.label}</p>
                  <p className="text-foreground text-sm text-mono normal-case truncate">{mcn?.value}</p>
                </div>
              ))}
            </>
          }
          footerClassName="grid grid-cols-3"
        >
          <div>
            <p className="text-lg font-semibold">{machine?.hostname}</p>
            <p className="text-mono">{machine?.server_device}</p>
          </div>
        </CardCore>
      </div>
    </Container>
  );
}

export default System
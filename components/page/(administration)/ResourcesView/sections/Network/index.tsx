import { T_ResourceStatic } from "@/app/api/resources/static/route";
import CardCore from "@/components/core/Card";
import Container from "@/components/core/Container";
import Icon from "@/components/core/Icon";
import { cn } from "@/lib/utils";
import { useResourceStore } from "@/store/useResourceStore";

type T_Network = {
  isLoading: boolean;
  data: T_ResourceStatic | undefined;
}

const Network = ({ isLoading, data }: T_Network) => {
  const { liveData } = useResourceStore();

  const netInData = liveData?.net_in;
  const netOutData = liveData?.net_out;
  
  const netInTotalData = liveData?.net_in_total;
  const netInTotalPct = (netInTotalData?.value ?? 0) / (netInTotalData?.max ?? 0) * 100
  const netOutTotalData = liveData?.net_out_total;
  const netOutTotalPct = (netOutTotalData?.value ?? 0) / (netOutTotalData?.max ?? 0) * 100

  const netIfaces = liveData?.net_interfaces;

  if (isLoading) {
    return (
      <Container title="Network" description="throughput and interfaces">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="skeleton h-78"/>
          <div className="skeleton h-78"/>
        </div>
      </Container>
    )
  }
  
  return (
    <Container title="Network" description="throughput and interfaces">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CardCore
          contentClassName="grid grid-cols-2"
          footer={
            <>
              <div className="flex-1">
                <p className="text-mono">download</p>
                <p className="font-mono text-xl font-semibold">{netInData?.value?.toFixed(1)} {netInData?.unit}</p>
              </div>
              <div className="flex-1">
                <p className="text-mono">upload</p>
                <p className="font-mono text-xl font-semibold">{netOutData?.value?.toFixed(1)} {netOutData?.unit}</p>
              </div>
            </>
          }
        >
          <CardCore contentClassName="">
            <div className="flex gap-4 items-center justify-between">
              <div className="flex gap-2 text-mono items-center">
                <Icon icon="LuArrowDown" />
                in
              </div>
              <p className="font-mono text-xl font-semibold text-twilight-400">{netInTotalData?.value?.toFixed(1)} {netInTotalData?.unit}</p>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-twilight-400 rounded-full" style={{ width: `${netInTotalPct}%` }}/>
            </div>
          </CardCore>
          <CardCore contentClassName="">
            <div className="flex gap-4 items-center justify-between">
              <div className="flex gap-2 text-mono items-center">
                <Icon icon="LuArrowUp" />
                out
              </div>
              <p className="font-mono text-xl font-semibold text-almond-500">{netOutTotalData?.value?.toFixed(1)} {netOutTotalData?.unit}</p>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-almond-500 rounded-full" style={{ width: `${netOutTotalPct}%` }}/>
            </div>
          </CardCore>
        </CardCore>

        <CardCore
          title="net interfaces"
          titleIcon="LuRadio"
          subtitle={<><span className="text-teal-500">{netIfaces?.filter((i) => i.isUp).length}</span> of {netIfaces?.length} active</>}
          contentClassName="max-h-[250px] overflow-auto scrollbar-none"
        >
          {netIfaces?.map((iface, idx) => (
            <div key={`net-iface-${iface.id}-${idx}`} className="flex gap-4 items-center justify-between border-b border-muted">
              <div className="flex gap-2 items-center">
                <Icon icon="LuNetwork" className={cn(iface.isUp && "text-teal-500")}/>
                <div>
                  <p className="font-mono">{iface.name}</p>
                  <p className="text-mono">{iface.ip}</p>
                </div>
              </div>
              <p className={cn("font-mono text-xs uppercase", iface.isUp ? "text-teal-500" : "text-muted-foreground")}>{iface.statusLabel}</p>
            </div>
          ))}
        </CardCore>
      </div>
    </Container>
  );
}

export default Network;
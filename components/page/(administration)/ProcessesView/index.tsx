"use client";

import CardCore from "@/components/core/Card";
import Container from "@/components/core/Container";
import Icon from "@/components/core/Icon";
import { useSyncProcessesData } from "@/hooks/useSyncProcessesData";
import { useProcessesStore } from "@/store/useProcessesStore";

type T_SummaryDetail = {
  label: string;
  value: string | number;
  description: string;
}

const ProcessesView = () => {
  const { isLoading } = useSyncProcessesData();
  const { liveData } = useProcessesStore();

  const summary = liveData?.summary;
  
  const summaryRender: T_SummaryDetail[] = [
    { label: "tracked", value: summary?.tracked_count ?? 0, description: "top processes by CPU" },
    { label: "cpu claimed", value: `${(summary?.cpu_total ?? 0).toFixed(1)}%`, description: `memory ${(summary?.mem_total ?? 0).toFixed(1)}%` },
    { label: "heaviest", value: `${summary?.heaviest_process?.name ?? ""}`, description: `pid ${summary?.heaviest_process?.pid ?? ""} • ${(summary?.heaviest_process?.cpu ?? 0).toFixed(1)}% CPU` },
  ]

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <CardCore key={`summary-data-${item}-skeleton`} title="">
              <div key={`summary-skeleton-${item}`} className="skeleton h-31" />
            </CardCore>
          ))}
        </div>

        <Container title="Ranked by CPU" description="8 highest • kill runaway tasks from here">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={`process-skeleton-${idx}`} className="skeleton h-30"/>
            ))}
          </div>
        </Container>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {summaryRender?.map((smry, idx) => (
          <CardCore key={`summary-data-${smry.label}-${idx}`} title={smry.label}>
            <p className="font-mono text-xl font-semibold">{smry.value}</p>
            <p className="text-xs text-muted-foreground">{smry.description}</p>
          </CardCore>
        ))}
      </div>

      <Container title="Ranked by CPU" description="8 highest • kill runaway tasks from here">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {liveData?.list?.map((ps, idx) => (
            <CardCore
              key={`process-data-${ps.name}-${idx}`}
              contentClassName="justify-between"
            >
              <div className="flex gap-4 justify-between">
                <div className="flex gap-2 items-center">
                  <p className="grid h-10 w-10 font-mono bg-muted text-muted-foreground rounded-xl place-content-center">
                    {idx + 1}
                  </p>
                  <div>
                    <p className="font-mono">{ps.name}</p>
                    <p className="text-mono">pid {ps.pid}</p>
                  </div>
                </div>

                <Icon icon="LuX" buttonVariant="destructive" onClick={() => {}} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex gap-4 items-center justify-between">
                    <div className="flex gap-2 text-mono items-center">
                      <Icon icon="LuCpu"/>
                      cpu
                    </div>
                    <p className="text-mono text-twilight-500">{ps.cpu}%</p>
                  </div>
                  <div className="w-full h-2 mt-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-twilight-500 rounded-full" style={{ width: `${ps.cpu}%` }}/>
                  </div>
                </div>
                <div>
                  <div className="flex gap-4 items-center justify-between">
                    <div className="flex gap-2 text-mono items-center">
                      <Icon icon="LuMemoryStick"/>
                      memory
                    </div>
                    <p className="text-mono text-almond-500">{ps.mem}%</p>
                  </div>
                  <div className="w-full h-2 mt-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-almond-500 rounded-full" style={{ width: `${ps.mem}%` }}/>
                  </div>
                </div>
              </div>
            </CardCore>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default ProcessesView
import { T_ResourceStatic } from "@/app/api/resources/static/route";
import CardCore from "@/components/core/Card";
import Container from "@/components/core/Container";
import { useResourceStore } from "@/store/useResourceStore";

type T_MemoryLoad = {
  isLoading: boolean;
  data: T_ResourceStatic | undefined;
}

const MemoryLoad = ({ isLoading, data }: T_MemoryLoad) => {
  const { liveData, history } = useResourceStore();
  
  const memoryData = liveData?.memory;
  const memoryPercentage = (memoryData?.value?? 0)/(memoryData?.max?? 0)*100
  
  const swapData = liveData?.swap;
  const swapPercentage = (swapData?.value?? 0)/(swapData?.max?? 0)*100

  const loadData = liveData?.load_avg;

  if (isLoading) {
    return (
      <Container title="Memory & Load" description={(data?.cpu_cores ?? "").replace("c", " cores").replace("t", " threads")}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="skeleton h-40"/>
          <div className="skeleton h-40"/>
        </div>
      </Container>
    )
  }
  
  return (
    <Container title="Memory & Load" description={(data?.cpu_cores ?? "").replace("c", " cores").replace("t", " threads")}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CardCore>
          <div className="flex flex-col gap-2">
            <div className="flex gap-4 justify-between">
              <div>
                <p className="font-mono text-base">RAM</p>
                <p className="text-mono normal-case">
                  {memoryData?.value}{memoryData?.unit} of {memoryData?.max}{memoryData?.unit}
                </p>
              </div>
              <p className="text-mono text-sm">{memoryPercentage.toFixed(2)}%</p>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-twilight-500 rounded-full" style={{ width: `${memoryPercentage}%` }}/>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-4 justify-between">
              <div>
                <p className="font-mono text-base">Swap</p>
                <p className="text-mono normal-case">
                  {/* {memoryData?.value}{memoryData?.unit} of {memoryData?.max}{memoryData?.unit} */}
                  {swapData?.value}{swapData?.unit} of {swapData?.max}{swapData?.unit}
                </p>
              </div>
              <p className="text-mono text-sm">{swapPercentage.toFixed(2)}%</p>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-twilight-400 rounded-full" style={{ width: `${swapPercentage}%` }}/>
            </div>
          </div>
        </CardCore>

        <div className="grid grid-cols-3 gap-px">
          <CardCore className="rounded-r-none">
            <p className="text-mono">load 1m</p>
            <p className="font-mono text-2xl text-twilight-500 font-semibold">{loadData?.load1 ?? 0.0}</p>
            <p className="text-mono">of {loadData?.max ?? 0} threads</p>
          </CardCore>
          <CardCore className="rounded-none">
            <p className="text-mono">load 5m</p>
            <p className="font-mono text-2xl text-twilight-500 font-semibold">{loadData?.load5 ?? 0.0}</p>
            <p className="text-mono">of {loadData?.max ?? 0} threads</p>
          </CardCore>
          <CardCore className="rounded-l-none">
            <p className="text-mono">load 15m</p>
            <p className="font-mono text-2xl text-twilight-500 font-semibold">{loadData?.load15 ?? 0.0}</p>
            <p className="text-mono">of {loadData?.max ?? 0} threads</p>
          </CardCore>
        </div>
      </div>
    </Container>
  );
}

export default MemoryLoad;
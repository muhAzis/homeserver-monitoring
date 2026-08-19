import { T_DashStatic } from "@/app/api/dashboard/static/route";
import Container from "../../Container";
import CardCore from "@/components/core/Card";
import { useSystemStore } from "@/store/useSystemStore";
import MetricChart from "@/components/core/MetricChart";

type T_Trends = {
  data: T_DashStatic;
  isLoading: boolean;
}

const Trends = ({ data, isLoading }: T_Trends) => {
  const { liveData, history } = useSystemStore();
  
  const cpuDataSet = history.map(h => h.live_resources.cpu);
  const memDataSet = history.map(h => h.live_resources.memory);
  const diskDataSet = history.map(h => h.live_resources.storage);
  
  return (
    <Container title="trends" description={`last 60 samples / ${60 * 3} seconds`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <CardCore title="cpu" subtitle={<span className="text-twilight-500 text-sm">{liveData?.live_resources?.cpu.value.toFixed(1) + "%"}</span>}>
          <MetricChart
            title="cpu"
            unit="%"
            chartData={cpuDataSet.map((data, idx) => ({i: idx, value: data.value }))}
            dataKey="cpu_percent"
            // color="var(--primary)"
            color="var(--color-twilight-500)"
          />
          <p className="text-mono">peak {Math.max(...cpuDataSet.map((data) => data.value)).toFixed(1)}%</p>
        </CardCore>
        <CardCore title="memory" subtitle={<span className="text-blue-500 text-sm">{liveData?.live_resources?.memory.value.toFixed(1) + "GB"}</span>}>
          <MetricChart
            title="memory"
            unit="GB"
            chartData={memDataSet.map((data, idx) => ({i: idx, value: data.value }))}
            dataKey="mem_percent"
            // color="var(--primary)"
            color="var(--color-blue-500)"
          />
          <p className="text-mono">peak {Math.max(...memDataSet.map((data) => data.value)).toFixed(1)}GB</p>
        </CardCore>
        <CardCore title="disk" subtitle={<span className="text-teal-500 text-sm">{liveData?.live_resources?.storage.value.toFixed(1) + "%"}</span>}>
          <MetricChart
            title="disk"
            unit="GB"
            chartData={diskDataSet.map((data, idx) => ({i: idx, value: data.value }))}
            dataKey="storage_percent"
            // color="var(--primary)"
            color="var(--color-teal-500)"
          />
          <p className="text-mono">peak {Math.max(...diskDataSet.map((data) => data.value)).toFixed(1)}GB</p>
        </CardCore>
      </div>
    </Container>
  );
}

export default Trends;
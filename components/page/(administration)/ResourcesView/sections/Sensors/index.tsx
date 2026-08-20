import { T_ResourceStatic } from "@/app/api/resources/static/route";
import CardCore from "@/components/core/Card";
import Container from "@/components/core/Container";
import { useResourceStore } from "@/store/useResourceStore";

type T_Sensors = {
  data: T_ResourceStatic | undefined;
  isLoading: boolean;
}

const Sensors = ({ data, isLoading }: T_Sensors) => {
  const { liveData } = useResourceStore();
  
  const cpuTemp = liveData?.cpu_temp;
  const diskTemps = liveData?.disk_temp ?? [];
  
  const temps = [
    { ...cpuTemp, name: "cpu" },
    ...diskTemps
  ];

  if (isLoading) {
    return Array.from({ length: 6 }).map((_, idx) => (
      <div key={`sensor-skeleton-${idx}`} className="skeleton h-32"/>
    ))
  }
  
  return (
    <Container title="Sensors" description="temperature readouts">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {temps?.map((temp, idx) => (
          <CardCore key={`sensor-read-${temp.name}-${idx}`} title={temp?.name} titleIcon="LuThermometer">
            <p className="text-mono"><span className="text-2xl font-semibold text-almond-500">{temp.value?? 0}</span>{temp.unit}</p>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-almond-500 rounded-full" style={{ width: `${((temp.value ?? 0) / (temp.max ?? 0)) * 100}%` }}/>
            </div>
          </CardCore>
        ))}
        <CardCore key={`sensor-read-arch`} title="arch">
          <p className="font-mono text-2xl font-semibold">{data?.os_arch}</p>
          <p className="text-mono">{data?.cpu}</p>
        </CardCore>
      </div>
    </Container>
  );
}

export default Sensors;
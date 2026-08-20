import { T_ResourceStatic } from "@/app/api/resources/static/route";
import CardCore from "@/components/core/Card";
import Container from "@/components/core/Container";

type T_Storage = {
  data: T_ResourceStatic | undefined;
  isLoading: boolean;
}

const Storage = ({ data, isLoading }: T_Storage) => {
  const mounts = data?.storage || [];
  
  if (isLoading) {
    return (
      <Container title="storage" description={`${mounts?.length} mounts`}>
        <div className="skeleton h-100" />
      </Container>
    )
  }
  
  return (
    <Container title="storage" description={`${mounts?.length} mounts`}>
      <CardCore contentClassName="gap-8">
        {mounts?.map((mount, idx) => (
          <div key={`strg-mount-${mount.mount}`} className="flex flex-col gap-2">
            <div className="flex gap-4 justify-between">
              <div>
                <p className="font-mono text-base">{mount.mount}</p>
                <p className="text-mono normal-case">{mount.device} • {mount.type}</p>
              </div>
              <p className="text-mono text-sm">{mount.used} / {mount.size}</p>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-teal-500 rounded-full" style={{ width: `${mount.percentage}` }}/>
            </div>
          </div>
        ))}
      </CardCore>
    </Container>
  );
}

export default Storage
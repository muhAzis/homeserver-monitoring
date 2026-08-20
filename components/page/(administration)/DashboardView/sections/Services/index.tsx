import { T_DashStatic } from "@/app/api/dashboard/static/route";
import { useSystemStore } from "@/store/useSystemStore";
import Container from "@/components/core/Container";
import CardCore from "@/components/core/Card";
import IconBlock from "@/components/core/IconBlock";
import Icon from "@/components/core/Icon";
import { cn } from "@/lib/utils";

type T_Services = {
  isLoading: boolean;
}

const Services = ({ isLoading }: T_Services) => {
  const { liveDataServices } = useSystemStore();
  
  const dockerServices = liveDataServices?.docker || [];
  const systemdServices = liveDataServices?.systemd || [];
  
  if (isLoading) {
    return (
      <Container title="Apps at a glance" description="docker & systemd">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="skeleton h-80"/>
          <div className="skeleton h-80"/>
        </div>
      </Container>
    )
  }
  
  return (
    <Container
      title="Apps at a glance"
      description="docker & systemd"
      subtitle={
        <a className="flex gap-2 text-twilight-500 hover:text-twilight-400 items-center cursor-pointer" href="/apps-and-services">
          <p>view all</p>
          <Icon icon="LuArrowRight" />
        </a>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CardCore
          title="docker containers"
          titleIcon="LuBoxes"
          subtitle={`${dockerServices.length}`}
          contentClassName="grid grid-cols-3 gap-4"
        >
          {dockerServices.length > 0
          ? dockerServices?.map((docker, idx) => (
              <CardCore
                key={`docker-service-${docker.name}-${idx}`}
                className="gap-0"
                contentClassName="flex-row gap-4 items-start justify-between"
                footer={
                  <div className="flex flex-1 gap-4 items-center justify-between">
                    <p className="text-mono">autostart {docker.autostart ? "on" : "off"}</p>
                    <div className="flex gap-3 items-center">
                      <Icon icon="LuSquare" className="text-muted-foreground"/>
                      <Icon icon="LuRotateCw" className="text-twilight-500"/>
                    </div>
                  </div>
                }
              >
                <div className="flex gap-2 items-center overflow-hidden">
                  <IconBlock icon="LuBoxes" variant="gray" />
                  <div className="overflow-hidden">
                    <p className="font-mono truncate">{docker.name}</p>
                    <p className="text-mono">docker</p>
                  </div>
                </div>
                <div className={cn("w-2 h-2 mt-2 rounded-full", docker.isRunning ? "bg-teal-500" : "bg-muted-foreground")}>
                  {docker.isRunning
                  ? <div className="w-2 h-2 bg-teal-500 rounded-full animate-ping"/>
                  : null}
                </div>
              </CardCore>))
            : <div className="flex flex-col col-span-3 w-full py-8 gap-2 text-center items-center justify-center">
                <Icon icon="LuPackageOpen" size={48} className="text-muted-foreground"/>
                <p className="text-sm tracking-widest text-muted-foreground">No docker services found</p>
              </div>}
        </CardCore>

        <CardCore
          title="systemd units"
          titleIcon="LuCog"
          subtitle={`${systemdServices.length}`}
          contentClassName="grid grid-cols-3 gap-4"
        >
          {systemdServices.length > 0
          ? systemdServices?.map((systemd, idx) => (
              <CardCore
                key={`systemd-service-${systemd.name}-${idx}`}
                className="gap-0"
                contentClassName="flex-row gap-4 items-start justify-between"
                footer={
                  <div className="flex flex-1 gap-4 items-center justify-between">
                    <p className="text-mono">autostart {systemd.autostart ? "on" : "off"}</p>
                    <div className="flex gap-3 items-center">
                      <Icon icon="LuSquare" className="text-muted-foreground"/>
                      <Icon icon="LuRotateCw" className="text-twilight-500"/>
                    </div>
                  </div>
                }
              >
                <div className="flex gap-2 items-center overflow-hidden">
                  <IconBlock icon="LuCog" variant="gray" />
                  <div className="overflow-hidden">
                    <p className="font-mono truncate">{systemd.name}</p>
                    <p className="text-mono">systemd</p>
                  </div>
                </div>
                <div className={cn("w-2 h-2 mt-2 rounded-full", systemd.isRunning ? "bg-teal-500" : "bg-muted-foreground")}>
                  {systemd.isRunning
                  ? <div className="w-2 h-2 bg-teal-500 rounded-full animate-ping"/>
                  : null}
                </div>
              </CardCore>))
            : <div className="flex flex-col col-span-3 w-full py-8 gap-2 text-center items-center justify-center">
                <Icon icon="LuCog" size={48} className="text-muted-foreground"/>
                <p className="text-sm tracking-widest text-muted-foreground">No systemd units found</p>
              </div>}
        </CardCore>
      </div>
    </Container>
  );
}

export default Services;
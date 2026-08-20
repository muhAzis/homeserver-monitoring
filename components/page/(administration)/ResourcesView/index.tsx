"use client";

import { useSyncResourceData } from "@/hooks/useSyncResourceData";
import Utilisation from "./sections/Utilisation";
import MemoryLoad from "./sections/MemoryLoad";
import { useQuery } from "@tanstack/react-query";
import { T_ResourceStatic } from "@/app/api/resources/static/route";
import apiClient from "@/lib/axios";
import Network from "./sections/Network";
import Storage from "./sections/Storage";
import Sensors from "./sections/Sensors";

const ResourcesView = () => {
  const { isLoading } = useSyncResourceData();
  
  const resourceStatic = useQuery<T_ResourceStatic>({
    queryKey: ["resources-static"],
    queryFn: async () => {
      const response = await apiClient.get("/resources/static");
      const data = response.data;
      
      return data;
    }
  });
  
  return (
    <div className="flex flex-col gap-8">
      <Utilisation isLoading={isLoading}/>
      <MemoryLoad isLoading={isLoading} data={resourceStatic.data}/>
      <Network isLoading={isLoading} data={resourceStatic.data}/>
      <Storage isLoading={isLoading} data={resourceStatic.data}/>
      <Sensors isLoading={isLoading} data={resourceStatic.data}/>
    </div>
  );
}

export default ResourcesView;
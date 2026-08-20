import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSystemStore } from '../store/useSystemStore';
import apiClient from '@/lib/axios';

export const useSyncSystemData = () => {
  const updateData = useSystemStore((state) => state.updateData);
  const updateDataServices = useSystemStore((state) => state.updateDataServices);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["live-system-data"],
    queryFn: async () => {
      const res = await apiClient.get("/dashboard/live");
      const data = res.data;

      return data;
    },
    refetchInterval: 3000,
    refetchOnWindowFocus: false,
  });

  const { data: services, isLoading: isLoadingServices, isError: isErrorServices } = useQuery({
    queryKey: ["live-system-services"],
    queryFn: async () => {
      const res = await apiClient.get("/dashboard/live/services");
      const data = res.data;

      return data;
    },
    refetchInterval: 10000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      updateData(data);
    }
  }, [data, updateData]);

  useEffect(() => {
    if (services) {
      updateDataServices(services);
    }
  }, [services, updateDataServices]);

  return { isLoading, isLoadingServices, isError, isErrorServices };
}
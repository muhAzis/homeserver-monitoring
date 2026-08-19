import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSystemStore } from '../store/useSystemStore';
import apiClient from '@/lib/axios';

export const useSyncSystemData = () => {
  const updateData = useSystemStore((state) => state.updateData);

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

  useEffect(() => {
    if (data) {
      updateData(data);
    }
  }, [data, updateData]);

  return { isLoading, isError };
}
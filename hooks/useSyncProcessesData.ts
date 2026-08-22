"use client";

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { useProcessesStore } from '@/store/useProcessesStore';

export const useSyncProcessesData = () => {
  const updateData = useProcessesStore((state) => state.updateData);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["live-processes-data"],
    queryFn: async () => {
      const res = await apiClient.get("/processes/live");
      const data = res.data;

      return data;
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      updateData(data);
    }
  }, [data, updateData]);

  return { isLoading, isError };
}
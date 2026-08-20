"use client";

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { useResourceStore } from '@/store/useResourceStore';

export const useSyncResourceData = () => {
  const updateData = useResourceStore((state) => state.updateData);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["live-resources-data"],
    queryFn: async () => {
      const res = await apiClient.get("/resources/live");
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
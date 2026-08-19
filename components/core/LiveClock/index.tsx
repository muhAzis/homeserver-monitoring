"use client";

import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";

type T_LiveClock = {
  className?: string;
  type: "clock" | "date";
  format?: string;
}

const LiveClock = ({ className, type, format }: T_LiveClock) => {
  const [time, setTime] = useState<string>("--:--:--");
  const [date, setDate] = useState<string>("--:--:--");
  const currentTime = useRef(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["serverTime"],
    queryFn: async () => {
      const response = await apiClient.get("/layout");
      const data = response.data;
      return data;
    },
    refetchOnWindowFocus: false, 
    staleTime: 5 * 60 * 1000, 
  });

  useEffect(() => {
    if (data?.serverTime) {
      currentTime.current = data.serverTime;
      
      setTime(dayjs(currentTime.current).format(format ?? "HH:mm:ss"));
      setDate(dayjs(currentTime.current).format(format ?? "DD MMM YYYY"));

      const timer = setInterval(() => {
        currentTime.current += 1000;
        setTime(dayjs(currentTime.current).format(format ?? "HH:mm:ss"));
        setDate(dayjs(currentTime.current).format(format ?? "DD MMM YYYY"));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [data]);

  if (isLoading || !time) {
    return <div className="w-17" />; 
  }

  if (isError) {
    return <span className="text-red-400 text-xs">Error</span>;
  }
  
  return (
    <div
      className={cn(
        {
          "font-mono text-xs text-muted-foreground uppercase tracking-widest": type === "clock",
          "text-sm text-muted-foreground": type === "date",
        },
        className
      )}
    >
      {type === "clock" ? time : date}
    </div>
  )
}

export default LiveClock
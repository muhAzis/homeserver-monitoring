"use client";

import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";

type T_LiveClock = {
  initialServerTime: number;
  className?: string;
}

const LiveClock = ({ initialServerTime, className }: T_LiveClock) => {
  const [time, setTime] = useState<string>("--:--:--");
  const currentTime = useRef(initialServerTime);

  useEffect(() => {
    setTime(dayjs(currentTime.current).format("HH:mm:ss"));
    
    const timer = setInterval(() => {
      currentTime.current += 1000;
      setTime(dayjs(currentTime.current).format("HH:mm:ss"));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!time) {
    return <div className="w-17" />; 
  }
  
  return (
    <div
      className={cn(
        "font-mono text-xs text-muted-foreground uppercase tracking-widest hidden sm:inline",
        className
      )}
    >
      {time}
    </div>
  )
}

export default LiveClock
import { NextResponse } from "next/server";
import si from "systeminformation";

export const dynamic = "force-dynamic";

export type T_DashLive = {
  battery: {
    is_charging: boolean;
    percentage: number;
    current_capacity: number;
    time_left: number;
    health: string;
    voltage: number;
  },
  live_resources: {
    cpu: {
      value: number;
      max: number;
      unit: string;
    },
    memory: {
      value: number;
      max: number;
      unit: string;
    },
    storage: {
      value: number;
      max: number;
      unit: string;
    },
    cpu_temp: {
      value: number;
      max: number;
      unit: string;
    },
    net_in: {
      value: number;
      max: number;
      unit: string;
    },
    net_out: {
      value: number;
      max: number;
      unit: string;
    }
  }
}

export async function GET(): Promise<NextResponse<T_DashLive>> {
  const defaultInterface = await si.networkInterfaceDefault();
  
  const [load, cpuTemp, battery, mem, openFiles, fsSize, netStats] = await Promise.all([
    si.currentLoad(),
    si.cpuTemperature(),
    si.battery(),
    si.mem(),
    si.fsOpenFiles(),
    si.fsSize(),
    si.networkStats(defaultInterface),
  ]);

  // return NextResponse.json({
  //   cpu: load.currentLoad,
  //   memory: (mem.active / mem.total) * 100,
  //   temp: temp.main,
  //   disk: fsSize,
  //   netIn: network[0]?.rx_sec || 0,
  //   netOut: network[0]?.tx_sec || 0,
  //   timestamp: Date.now(),
  // });
  // console.log({battery})

  const physicalDisks = fsSize
  .filter(
    (disk) =>
      !disk.fs.includes("loop") &&
      !disk.type.includes("squashfs") &&
      !disk.type.includes("tmpfs")
  );

  const totalUsedBytes = physicalDisks.reduce((acc, disk) => acc + disk.used, 0);
  const totalSizeBytes = physicalDisks.reduce((acc, disk) => acc + disk.size, 0);

  // console.log({physicalDisks})
  
  const netData = Array.isArray(netStats) ? netStats[0] : netStats;
  const netInBytes = netData?.rx_sec || 0;
  const netOutBytes = netData?.tx_sec || 0;
  
  return NextResponse.json({
    battery: {
      is_charging: battery.isCharging,
      percentage: battery.percent,
      current_capacity: battery.currentCapacity,
      time_left: battery.timeRemaining,
      health: `${Math.round((battery.maxCapacity / battery.designedCapacity) * 100)}%`,
      voltage: battery.voltage,
    },
    live_resources: {
      cpu: {
        value: load.currentLoad,
        max: 100,
        unit: "%"
      },
      memory: {
        value: Number((mem.active / 1024 / 1024 / 1024).toFixed(2)),
        max: Number((mem.total / 1024 / 1024 / 1024).toFixed(2)),
        unit: "GB"
      },
      storage: {
        value: Number((totalUsedBytes / (1024 ** 3)).toFixed(1)),
        max: Number((totalSizeBytes / (1024 ** 3)).toFixed(1)),
        unit: "GB"
      },
      cpu_temp: {
        value: cpuTemp.main,
        max: 95,
        unit: "°C"
      },
      net_in: {
        value: netInBytes < 1024
          ? netInBytes
          : netInBytes >= 1024 && netInBytes < 4096
            ? (netInBytes / 1024)
            : (netInBytes / 4096),
        max: 0,
        unit: netInBytes < 1024
          ? "B/s"
          : netInBytes >= 1024 && netInBytes < 4096
            ? "KB/s"
            : "MB/s"
      },
      net_out: {
        value: netOutBytes < 1024
          ? netOutBytes
          : netOutBytes >= 1024 && netOutBytes < 4096
            ? (netOutBytes / 1024)
            : (netOutBytes / 4096),
        max: 0,
        unit: netOutBytes < 1024
          ? "B/s"
          : netOutBytes >= 1024 && netOutBytes < 4096
            ? "KB/s"
            : "MB/s"
      }
    }
  });
}
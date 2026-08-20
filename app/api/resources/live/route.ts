import { NextResponse } from "next/server";
import si from "systeminformation";
import os from "os";
import bytesTemplate from "@/lib/bytes-render";

export const dynamic = "force-dynamic";

export type T_ResourceLive = {
  cpu: {
    value: number;
    max: number;
    unit: string;
  },
  load_avg: {
    load1: number;
    load5: number;
    load15: number;
    max: number;
  },
  memory: {
    value: number;
    max: number;
    unit: string;
  },
  swap: {
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
  disk_temp: {
    name: string;
    value: number;
    max: number;
    unit: string;
  }[],
  net_in: {
    value: number;
    max: number;
    unit: string;
  },
  net_out: {
    value: number;
    max: number;
    unit: string;
  },
  net_in_total: {
    value: number;
    max: number;
    unit: string;
  },
  net_out_total: {
    value: number;
    max: number;
    unit: string;
  },
  net_interfaces: {
    id: string;
    name: string;
    ip: string;
    statusLabel: string;
    isUp: boolean;
  }[];
}

export async function GET(): Promise<NextResponse<T_ResourceLive | { error: string } >> {
  try {
    const defaultInterface = await si.networkInterfaceDefault();
  
    const [load, cpuTemp, mem, fsSize, netStats, netInterfaces, diskLayout] = await Promise.all([
      si.currentLoad(),
      si.cpuTemperature(),
      si.mem(),
      si.fsSize(),
      si.networkStats(defaultInterface),
      si.networkInterfaces(),
      si.diskLayout()
    ]);

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

    const totalIn = netData?.rx_bytes || 0;
    const totalOut = netData?.tx_bytes || 0;
    const maxISP = 500;

    const rawLoadAvg = os.loadavg();
    const maxThreads = os.cpus().length;

    const interfacesArray = Array.isArray(netInterfaces) ? netInterfaces : [netInterfaces];
    const processedInterfaces = interfacesArray
      .filter((iface) => iface.iface !== "lo");
    
    return NextResponse.json({
      cpu: {
        value: load.currentLoad,
        max: 100,
        unit: "%"
      },
      load_avg: {
        load1: Number(rawLoadAvg[0].toFixed(2)),
        load5: Number(rawLoadAvg[1].toFixed(2)),
        load15: Number(rawLoadAvg[2].toFixed(2)),
        max: maxThreads
      },
      memory: {
        value: Number((mem.active / 1024 / 1024 / 1024).toFixed(2)),
        max: Number((mem.total / 1024 / 1024 / 1024).toFixed(2)),
        unit: "GB"
      },
      swap: {
        value: Number((mem.swaptotal / 1024 / 1024 / 1024).toFixed(2)),
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
      disk_temp: diskLayout.map((disk) => ({
        name: disk.name,
        value: disk.temperature ?? 0,
        max: 95,
        unit: "°C"
      })),
      net_in: {
        value: Number(bytesTemplate(netInBytes).value),
        max: 0,
        unit: bytesTemplate(netInBytes).unit + "/s"
      },
      net_out: {
        value: Number(bytesTemplate(netOutBytes).value),
        max: 0,
        unit: bytesTemplate(netOutBytes).unit + "/s"
      },
      net_in_total: {
        value: Number(bytesTemplate(totalIn).value),
        max: Number(bytesTemplate(maxISP * 1024 * 1024 * 1024).value),
        unit: bytesTemplate(totalIn).unit
      },
      net_out_total: {
        value: Number(bytesTemplate(totalOut).value),
        max: Number(bytesTemplate(maxISP * 1024 * 1024 * 1024).value),
        unit: bytesTemplate(totalOut).unit
      },
      net_interfaces: processedInterfaces.map((iface) => {
        const isUp = iface.operstate === "up" || (iface.operstate === "unknown" && iface.ip4 !== undefined);
        
        let statusLabel = "";
        if (!isUp) {
          statusLabel = "disabled";
        } else if (iface.iface.includes("tailscale") || iface.iface.includes("wg")) {
          statusLabel = "wireguard"; 
        } else if (iface.speed) {
          statusLabel = iface.speed >= 1000 
            ? `${(iface.speed / 1000).toFixed(0)} GBPS` 
            : `${iface.speed} MBPS`;
        } else {
          statusLabel = "connected";
        }

        return {
          id: iface.iface,
          name: iface.iface,
          ip: iface.ip4 || "_", 
          statusLabel: statusLabel,
          isUp: isUp
        };
      })
    });
  } catch (error) {
    console.error("Error fetching system services:", error);
    return NextResponse.json({ error: "Failed to fetch apps" }, { status: 500 });
  }
}
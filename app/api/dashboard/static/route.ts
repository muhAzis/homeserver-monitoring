import { NextResponse } from "next/server";
import si from "systeminformation";
import os from "os";
import dayjs from "@/lib/dayjs";
import packageInfo from "@/package.json";
import bytesTemplate from "@/lib/bytes-render";

export const dynamic = "force-dynamic";

export type T_DashStatic = {
  machine: {
    uptime: string;
    timezone: string;
    app_version: string;
    hostname: string;
    server_device: string;
    os_platform: string;
    os_distro: string;
    os_arch: string;
    os_kernel: string;
    cpu: string;
    cpu_cores: string;
    memory: string;
    local_ip: string;
    public_ip: string;
    avg_load: number;
  };
  storage: {
    device: string;
    mount: string;
    type: string;
    size: string;
    used: string;
    available: string;
    percentage: string;
  }[];
}

export async function GET(): Promise<NextResponse<T_DashStatic>> {
  const [osInfo, cpu, fsSize, netItf, processes, system, memory] = await Promise.all([
    si.osInfo(),
    si.cpu(),
    // si.diskLayout(),
    // si.blockDevices(),
    si.fsSize(),
    si.networkInterfaces(),
    si.currentLoad(),
    si.system(),
    si.mem()
  ]);
  const defaultInterfaceName = await si.networkInterfaceDefault();
  const activeInterface = netItf.find(
    (net) => net.iface === defaultInterfaceName
  );

  const publicIpResponse = await fetch("https://api.ipify.org?format=json");
  const publicIpData = await publicIpResponse.json();
  const publicIp = publicIpData.ip;

  const serverUptimeSeconds = os.uptime();
  const uptimeObj = dayjs.duration(serverUptimeSeconds, "seconds");
  const days = Math.floor(uptimeObj.asDays());
  const hours = uptimeObj.hours().toString().padStart(2, "0"); 
  const minutes = uptimeObj.minutes().toString().padStart(2, "0");
  const displayUptime = `${days}D ${hours}H ${minutes}M`;

  // return NextResponse.json({
  //   hostname: osInfo.hostname,
  //   os: `${osInfo.distro} ${osInfo.release}`,
  //   kernel: osInfo.kernel,
  //   cpuModel: `${cpu.manufacturer} ${cpu.brand}`,
  //   cores: `${cpu.physicalCores}c / ${cpu.cores}t`,
  //   ip: net[0]?.ip4 || "Unknown",
  //   hasBattery: battery.hasBattery,
  // });
  // console.log({netCon})

  const physicalDisks = fsSize
  .filter(
    (disk) =>
      !disk.fs.includes("loop") &&
      !disk.type.includes("squashfs") &&
      !disk.type.includes("tmpfs")
  );
  
  return NextResponse.json({
    machine: {
      uptime: displayUptime,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      app_version: process.env.NEXT_PUBLIC_APP_VERSION || packageInfo.version,
      hostname: osInfo.hostname,
      server_device: system.model,
      os_platform: osInfo.platform,
      os_distro: osInfo.distro,
      os_arch: osInfo.arch,
      os_kernel: osInfo.kernel,
      cpu: `${cpu.manufacturer} ${cpu.brand}`,
      cpu_cores: `${cpu.physicalCores}c / ${cpu.cores}t`,
      memory: `${(memory.total / 1024 / 1024 / 1024).toFixed(0)}GB`,
      local_ip: activeInterface ? activeInterface.ip4 : "127.0.0.1",
      public_ip: publicIp,
      avg_load: processes.avgLoad,
    },
    storage: physicalDisks.map((disk) => ({
      device: disk.fs,
      mount: disk.mount,
      type: disk.type,
      size: `${bytesTemplate(disk.size).value} ${bytesTemplate(disk.size).unit}`,
      used: `${bytesTemplate(disk.used).value} ${bytesTemplate(disk.used).unit}`,
      available: `${bytesTemplate(disk.available).value} ${bytesTemplate(disk.available).unit}`,
      percentage: disk.use.toFixed(0) + "%",
    }))
  });
}
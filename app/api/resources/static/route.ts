import { NextResponse } from "next/server";
import si from "systeminformation";
import os from "os";
import dayjs from "@/lib/dayjs";
import packageInfo from "@/package.json";
import bytesTemplate from "@/lib/bytes-render";

export const dynamic = "force-dynamic";

export type T_ResourceStatic = {
  os_arch: string;
  os_kernel: string;
  cpu: string;
  cpu_cores: string;
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

export async function GET(): Promise<NextResponse<T_ResourceStatic>> {
  const [fsSize, cpu, osInfo] = await Promise.all([
    si.fsSize(),
    si.cpu(),
    si.osInfo(),
  ]);

  const physicalDisks = fsSize
  .filter(
    (disk) =>
      !disk.fs.includes("loop") &&
      !disk.type.includes("squashfs") &&
      !disk.type.includes("tmpfs")
  );
  
  return NextResponse.json({
    os_arch: osInfo.arch,
    os_kernel: osInfo.kernel,
    cpu: `${cpu.manufacturer} ${cpu.brand}`,
    cpu_cores: `${cpu.physicalCores}c / ${cpu.cores}t`,
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
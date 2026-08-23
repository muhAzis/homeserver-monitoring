import { NextResponse } from "next/server";
import si from 'systeminformation';

export const dynamic = "force-dynamic";

type T_Process = {
  pid: number;
  name: string;
  cpu: number;
  mem: number;
}

export type T_ProcessesLive = {
  summary: {
    tracked_count: number;
    cpu_total: number;
    mem_total: number;
    heaviest_process: T_Process;
  };
  list: T_Process[];
}

export async function GET(): Promise<NextResponse<T_ProcessesLive | { error: string } >> {
  try {
    const [processes, currentLoad, mem] = await Promise.all([
      si.processes(),
      si.currentLoad(),
      si.mem(),
    ]);

    const topProcesses = processes.list
    .sort((a, b) => b.cpu - a.cpu)
    .slice(0, 8)
    .map((p) => ({
      pid: p.pid,
      name: p.name,
      cpu: Number(p.cpu),
      mem: Number(p.mem),
    }));
    
    return NextResponse.json({
      summary: {
        tracked_count: processes.all,
        // cpu_total: topProcesses.reduce((acc, curr) => acc + curr.cpu, 0),
        // mem_total: topProcesses.reduce((acc, curr) => acc + curr.mem, 0),
        cpu_total: currentLoad.currentLoad,
        mem_total: (mem.used / mem.total) * 100,
        heaviest_process: topProcesses[0],
      },
      list: topProcesses,
    });
  } catch (error) {
    console.error("Error fetching system services:", error);
    return NextResponse.json({ error: "Failed to fetch apps" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import si from 'systeminformation';

export type T_ServicesLive = {
  systemd: {
    id: string;
    name: string;
    type: "SYSTEMD" | "DOCKER";
    isRunning: boolean;
    autostart: boolean;
  }[],
  docker: {
    id: string;
    name: string;
    type: "SYSTEMD" | "DOCKER";
    isRunning: boolean;
    autostart: boolean;
  }[]
}

export async function GET(): Promise<NextResponse<T_ServicesLive | { error: string }>> {
  try {
    const [services, dockerCont] = await Promise.all([
      si.services("nginx, docker"),
      si.dockerContainers(true)
    ]);

    let dockerServices: si.Systeminformation.DockerContainerData[] = [];
    try {
      // const targetContainers = ["plex-media-server", "jellyfin", "postgres", "home-assistant"];
      const targetContainers = [""];
      dockerServices = dockerCont
      .filter((container) => {
        const cleanName = container.name.replace(/^\//, "");
        return targetContainers.includes(cleanName);
      })
    } catch (error) {
      console.warn("Failed to fetch docker containers", error);
    }

    return NextResponse.json({
      systemd: services.map((svc) => ({
        id: svc.name,
        name: svc.name,
        type: "SYSTEMD",
        isRunning: svc.running,
        autostart: svc.startmode === "auto", 
      })),
      docker: dockerServices.map((container) => ({
        id: container.id,
        name: container.name.replace(/^\//, ""),
        type: "DOCKER",
        isRunning: container.state === "running",
        autostart: true,
      }))
    })
  } catch (error) {
    console.error("Error fetching system services:", error);
    return NextResponse.json({ error: "Failed to fetch apps" }, { status: 500 });
  }
}
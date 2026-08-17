"use client";

import Form from "@/components/core/Form";
import Icon, { T_IconList } from "@/components/core/Icon";
import IconBlock from "@/components/core/IconBlock";
import ThemeSwitcher from "@/components/core/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/axios";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import z from "zod";
import packageInfo from "@/package.json";
import os from "os";
import dayjs from "@/lib/dayjs";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type T_Features = {
  icon: T_IconList;
  label: string;
}

type T_LoginSchema = z.infer<typeof loginSchema>;

const LoginView = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [isShowPass, setIsShowPass] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const serverUptimeSeconds = os.uptime();
  const uptimeObj = dayjs.duration(serverUptimeSeconds, "seconds");
  const days = Math.floor(uptimeObj.asDays());
  const hours = uptimeObj.hours().toString().padStart(2, "0"); 
  const displayUptime = `${days}D ${hours}H`;

  const hostname = os.hostname();
  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || packageInfo.version;

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const features: T_Features[] = [
    { icon: "LuCpu", label: "resources" },
    { icon: "LuActivity", label: "live apps" },
    { icon: "LuShieldCheck", label: "alerts" },
  ]

  const login = useMutation({
    mutationKey: ["login"],
    mutationFn: async (loginData: T_LoginSchema) => {
      const response = await apiClient.post("/auth/login", loginData);
      const data = response.data;

      return data;
    },
    onSuccess: () => {
      toast.success("Login successful");
      router.push("/dashboard");
    },
    onError: (err) => {
      toast.error(`Login failed: ${err.message}`);
    }
  });
  
  const handleLogin = async (data: T_LoginSchema) => {
    await login.mutateAsync(data);
  }
  
  return (
    <div className="lg:grid lg:grid-cols-2 w-full h-full bg-background">
      <aside className="relative hidden lg:flex lg:flex-col bg-sidebar w-full h-full p-12 gap-4 justify-between">
        <div className="flex gap-4 items-center">
          <IconBlock
            icon="LuServer"
            variant="twilight"
          />
          <div>
            <p className="font-bold capitalize">{hostname.replaceAll("-", " ").replaceAll(".", " - ")}</p>
            <p className="text-xs text-muted-foreground font-mono">RX 78 • LOCAL INSTANCE</p>
          </div>
        </div>

        <div className="flex flex-col w-full max-w-md gap-4">
          <p className="text-3xl font-bold">Every reading from your machine, on one panel.</p>
          <p className="text-sm text-muted-foreground">CPU, memory, storage, temperatures, battery health and every app running inside your home server — live.</p>
          <div className="grid grid-cols-3 gap-4">
            {features.map((feature) => (
              <div key={feature.label} className="flex px-3 py-2.5 gap-2 bg-card border rounded-2xl items-center">
                <Icon icon={feature.icon} className="text-twilight-500" />
                <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs font-mono text-muted-foreground tracking-widest">
          AGENT V{appVersion} • UPTIME {displayUptime}
        </p>
        
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--color-twilight-500)" }}
        />
      </aside>

      <div className="relative grid w-full h-full p-4 border place-items-center">
        <ThemeSwitcher className="absolute top-12 right-12"/>
        
        <div className="flex flex-col w-full max-w-md gap-2">
          <p className="text-xs text-muted-foreground font-mono tracking-widest">AUTHENTICATE</p>
          <p className="text-3xl font-bold">Welcome Back</p>
          <p className="text-muted-foreground">Sign in to open your server dashboard.</p>

          <Form
            schema={loginSchema}
            onSubmit={handleLogin}
            fields={[
              { name: "username", label: "Username", type: "text", placeholder: "your_user_name" },
              {
                name: "password",
                label: "Password",
                type: isShowPass ? "text" : "password",
                placeholder: isShowPass ? "Your password" : "••••••••",
                icon: isShowPass ? "LuEyeOff" : "LuEye",
                iconOnClick: () => setIsShowPass((prev) => !prev)
              },
            ]}
            defaultValues={{
              username: "",
              password: "",
            }}
            className="mt-4"
            customSubmitButton={() => (
              <Button type="submit" className="mt-4 py-6!" disabled={login.isPending}>
                <Icon icon={login.isPending ? "LuLoaderCircle" : "LuLock"} className={cn(login.isPending ? "animate-spin" : "")}/>
                {login.isPending ? "Signing In..." : "Sign In"}
              </Button>
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default LoginView;
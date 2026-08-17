"use client";

import Form from "@/components/core/Form";
import Icon from "@/components/core/Icon";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/axios";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type T_LoginSchema = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const router = useRouter();
  const [isShowPass, setIsShowPass] = useState<boolean>(false);
  
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
  )
}

export default LoginForm
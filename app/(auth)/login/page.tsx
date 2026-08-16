import LoginView from "@/components/page/(auth)/LoginView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
};

const Login = () => {
  return (
    <LoginView />
  );
};

export default Login;
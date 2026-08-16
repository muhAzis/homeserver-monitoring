"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        const status = error?.response?.status;
        // Jangan retry jika HTTP status adalah 401, 403, 404, atau 500
        if (status === 401 || status === 403 || status === 404 || status === 500) {
          return false;
        }
        // Jika error jenis lain (seperti Network Error / Timeout), coba retry maksimal 3 kali
        return failureCount < 3;
      },
    },
  },
});

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
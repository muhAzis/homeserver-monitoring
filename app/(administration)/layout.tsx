import { SidebarProvider } from "@/components/ui/sidebar";
import Layout from "@/components/page/(administration)/Layout";
import dayjs from "@/lib/dayjs";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const serverTimeMs = dayjs().valueOf();
  
  return (
    <SidebarProvider>
      <Layout initialServerTime={serverTimeMs}>
        { children }
      </Layout>
    </SidebarProvider>
  )
}

export default AdminLayout;
import { SidebarProvider } from "@/components/ui/sidebar";
import Layout from "@/components/page/(administration)/Layout";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <Layout>
        { children }
      </Layout>
    </SidebarProvider>
  )
}

export default AdminLayout;
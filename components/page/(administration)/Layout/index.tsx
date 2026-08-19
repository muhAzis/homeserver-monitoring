import Container from './Container';
import os from "os";

type T_AdminLayout = {
  children: React.ReactNode;
}

export const dynamic = 'force-dynamic';

const AdminLayout = ({ children }: T_AdminLayout) => {
  const hostname = os.hostname();
  
  return (
    <Container hostname={hostname}>
      {children}
    </Container>
  )
}

export default AdminLayout
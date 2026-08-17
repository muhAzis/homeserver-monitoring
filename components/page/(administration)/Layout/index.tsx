import dayjs from '@/lib/dayjs';
import Container from './Container';

type T_AdminLayout = {
  children: React.ReactNode;
}

export const dynamic = 'force-dynamic';

const AdminLayout = ({ children }: T_AdminLayout) => {  
  const serverTimeMs = dayjs().valueOf();
  
  return (
    <Container initialServerTime={serverTimeMs}>
      {children}
    </Container>
  )
}

export default AdminLayout
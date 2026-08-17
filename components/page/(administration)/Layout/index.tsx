import Container from './Container';

type T_AdminLayout = {
  children: React.ReactNode;
}

export const dynamic = 'force-dynamic';

const AdminLayout = ({ children }: T_AdminLayout) => {
  return (
    <Container>
      {children}
    </Container>
  )
}

export default AdminLayout
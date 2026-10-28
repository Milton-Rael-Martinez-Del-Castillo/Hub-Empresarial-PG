import { Navigate } from 'react-router-dom';
import { isAdminLoggedIn } from '../api/hubApi';

function ProtectedAdmin({ children }: { children: React.ReactNode }) {
  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}

export default ProtectedAdmin;
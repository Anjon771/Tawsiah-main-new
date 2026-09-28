import { useUser } from '../contexts/UserContext';
import { Navigate } from 'react-router-dom';

function ProtectedAdminRoute({ children }) {
  const { user } = useUser();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'ADMIN') return <Navigate to="/home" replace />;

  return children;
}

export default ProtectedAdminRoute;

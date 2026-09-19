import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function PrivateRoute({ children }) {
  const { token, initialized } = useAuth();
  if (!initialized) return null;
  return token ? children : <Navigate to="/login" replace />;
}

export function AdminRoute({ children }) {
  const { token, user, initialized } = useAuth();
  if (!initialized) return null;
  if (!token) return <Navigate to="/login" replace />;
  // if (user?.role !== 'admin' && user?.role !== 'organiser') return <Navigate to="/" replace />;
  return children;
}

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts';

interface PublicRouteProps {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated } = useAuth();

  // If user is authenticated, redirect to dashboard
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}

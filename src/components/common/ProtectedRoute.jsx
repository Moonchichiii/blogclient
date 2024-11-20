import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/Accounts/hooks/useAuth';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  // Check roles if specified
  if (roles.length > 0 && user?.account?.roles) {
    const hasRequiredRole = roles.some(role => {
      switch (role) {
        case 'admin':
          return user.account.roles.is_admin;
        case 'staff':
          return user.account.roles.is_staff;
        case 'superuser':
          return user.account.roles.is_superuser;
        default:
          return false;
      }
    });

    if (!hasRequiredRole) {
      return (
        <Navigate 
          to="/dashboard" 
          state={{
            from: location,
            message: "You don't have permission to access this page"
          }}
          replace
        />
      );
    }
  }

  return children;
};

export default ProtectedRoute;
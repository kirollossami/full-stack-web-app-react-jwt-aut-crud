import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const adminToken = localStorage.getItem('adminToken');

  if (adminOnly) {
    // For admin routes
    if (!adminToken) {
      return <Navigate to="/dashboard-login" replace />;
    }
    return children;
  } else {
    // For regular user routes
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  }
};

export default ProtectedRoute;
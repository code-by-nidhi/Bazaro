import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../common/Loader';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader fullScreen text="Checking admin privileges..." />;
  }

  // The provider never stores a non-admin session, so either check failing
  // means the same thing here: sign in again.
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default AdminRoute;

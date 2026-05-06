import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';

const ProtectedRoute: React.FC<{ requiredRole?: Role }> = ({ requiredRole }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  if (requiredRole) {
    const hasRole = user?.role === requiredRole || user?.roles?.includes(requiredRole);
    if (!hasRole) return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

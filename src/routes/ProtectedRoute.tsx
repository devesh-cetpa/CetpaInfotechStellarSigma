import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from '../app/hooks';
import { getSessionItem } from '@/lib/helperFunction';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { Roles } = useAppSelector((state) => state.user);
  const isAuthenticated = getSessionItem('token');

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  // if (!allowedRoles.includes(Roles || '')) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
